<template>
	<div id="allocate" class="view">
		<h1>Generate Allocation</h1>

		<div class="tab-control">
			<label for="import-auto" :class="importMode == 'Auto' ? 'active': ''">Automatic</label>
			<input type="radio" name="import-auto" id="import-auto" value="Auto" v-model="importMode" />
			<label for="import-manual" :class="importMode == 'Manual' ? 'active': ''">Manual</label>
			<input type="radio" name="import-manual" id="import-manual" value="Manual" v-model="importMode"/>
		</div>

		<p v-if="importMode == 'Auto'">Tabbycat import may take a minute, please be patient.</p>
		<div v-if="importMode == 'Auto'" class="tabby-details">
			<label>URL: </label>
			<input type="text" v-model="tabbyURL" placeholder="Tabbycat URL" @change="saveChanges" />
			<label>API Token: </label>
			<input type="text" v-model="tabbyToken" placeholder="API Token" @change="saveChanges" />
			<button @click="importData">Import</button>
		</div>

		<div v-if="importMode == 'Manual'">
			<label for="drawFile">Import Tabbycat Draw HTML:</label>
			<input type="file" name="drawFile" id="drawFile" accept="text/html" multiple="false" @change="loadFile" />
		</div>

		<div v-for="(draw, name) in draws" :key="name">
			<div class="button-spacer">
				<h4>{{name}}</h4>
				<button @click="exportAllocation(name)">Export Zoom Allocation</button>
			</div>

			<table>
				<thead><tr>
					<td>Venue</td>
					<td>{{$localise("general.teams")}}</td>
					<td>{{$localise("general.judges")}}</td>
				</tr></thead>
				<tbody>
					<tr v-for="room in draw" :key="room.name">
						<td>{{room.name}}</td>
						<td>{{room.teams.join(", ")}}</td>
						<td>{{room.judges.join(", ")}}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<a :href="exportURI" class="export-helper" :download="downloadName"></a>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import { CSVFile } from "../lib/CSVFile";
	import { Draw } from "../lib/Draw";
	import { DrawHTMLParser } from "../lib/DrawHTMLParser";
	import { TabbyImporter } from "../lib/TabbyImporter";

	const tabbyToken = window.localStorage.getItem("tabbyToken"),
		tabbyURL = window.localStorage.getItem("tabbyURL");

	interface Participant {
		name: string;
		emails: string[];
	}

	export default Vue.extend({
		data() {
			return {
				downloadName: "",
				draws: {} as Record<string, Draw>,
				exportURI: "",
				importMode: "Auto",
				tabbyToken: (tabbyToken) ? tabbyToken : "",
				tabbyURL: (tabbyURL) ? tabbyURL : "",
			};
		},

		methods: {
			exportAllocation(name: string): void {
				const file = new CSVFile(["Pre-assign Room Name", "Email Address"], []);

				(this.draws[name] as Draw).forEach((room) => {
					room.judges.forEach((name) => {
						const j: Participant = this.$store.getters.judges.find((judge: Participant) => name == judge.name);
						if (j) j.emails.forEach((email) => file.rows.push([room.name, email]));
					});

					room.teams.forEach((name) => {
						const t: Participant = this.$store.getters.teams.find((team: Participant) => name == team.name);
						if (t) t.emails.forEach((email) => file.rows.push([room.name, email]));
						else console.log(`Couldn't find '${name}'`);
					});
				});

				this.downloadName = name.replace(/ /g, "-").toLowerCase() + "-zoom-allocation.csv";
				this.exportURI = `data:text/csv;charset=UTF-8,${encodeURIComponent(file.toString())}`;
				// Use next tick to ensure that the fields update before download
				this.$nextTick().then(() => (document.querySelector("a.export-helper") as HTMLButtonElement).click());
			},

			loadFile(event: Event): void {
				const element = event.target as HTMLInputElement;

				if (element.files && element.files.length) {
					const reader = new FileReader();

					reader.addEventListener("load", (event) => {
						const parser = new DrawHTMLParser(event.target!.result!.toString());
						this.draws = Object.assign({}, parser.draws)
						window.localStorage.setItem("draws", JSON.stringify(this.draws));
					});

					reader.readAsText(element.files[0]);
				}
			},

			importData(): void {
				if (!this.tabbyURL || !this.tabbyToken) alert("Missing Tabbycat details.");
				else {
					const importer = new TabbyImporter(this.tabbyURL, this.tabbyToken);
					importer.getDraws().then((draws) => this.draws = draws);
					// alert("Tabbycat import may take a minute, please be patient.");
					window.localStorage.setItem("draws", JSON.stringify(this.draws));
					this.saveChanges();
				}
			},

			saveChanges(): void {
				if (this.tabbyURL) window.localStorage.setItem("tabbyURL", this.tabbyURL);
				if (this.tabbyToken) window.localStorage.setItem("tabbyToken", this.tabbyToken);
			},
		},

		mounted(): void {
			let draws = window.localStorage.getItem("draws");

			if (draws) this.draws = JSON.parse(draws);
		},
	});
</script>

<style lang="scss">
	#allocate {
		.tabby-details {
			display: flex;

			> * {
				margin: 0 0.5rem;

				&:first-child {
					margin-left: 0;
				}

				&:last-child {
					margin-right: 0;
				}
			}

			input[type=text] {
				flex-grow: 1;
			}
		}
	}
</style>

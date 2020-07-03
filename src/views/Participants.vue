<template>
	<div id="participants" class="view">
		<h1>Manage Participants</h1>

		<div class="button-spacer">
			<button @click="csvImporter = true">Import from File...</button>
			<button @click="tabbyImporter = true">Import from Tabbycat...</button>
		</div>
		<div class="button-spacer">
			<button @click="exportData">Export Current Data</button>
			<button @click="clearData" class="danger">Clear Data</button>
		</div>

		<div class="tab-control">
			<label for="type-teams" :class="participantType == 'Team' ? 'active': ''">{{$localise("general.teams")}}</label>
			<input type="radio" name="type-teams" id="type-teams" value="Team" v-model="participantType" />
			<label for="type-judges" :class="participantType == 'Judge' ? 'active': ''">{{$localise("general.judges")}}</label>
			<input type="radio" name="type-judges" id="type-judges" value="Judge" v-model="participantType"/>
		</div>

		<table>
			<thead>
				<tr>
					<td>{{$localise("general.name")}}</td>
					<td>{{$localise("general.emails")}}</td>
					<td class="table-controls">
						<button @click="displayAdd = !displayAdd"><i class="fas fa-plus"></i></button>
					</td>
				</tr>
			</thead>

			<tbody>
				<tr v-if="displayAdd">
					<td><input type="text" placeholder="Name" v-model="newParticipant.name" /></td>

					<td>
						<input type="text" placeholder="Email" v-for="(val, i) in newParticipant.emails" :key="i" v-model="newParticipant.emails[i]" />
						<button @click="newParticipant.emails.push(undefined)"><i class="fas fa-plus"></i></button>
						<button v-show="newParticipant.emails.length > 1" @click="newParticipant.emails.pop()"><i class="fas fa-minus"></i></button>
					</td>

					<td class="table-controls">
						<button @click="addParticipant()"><i class="fas fa-check"></i></button>
						<button @click="displayAdd = false"><i class="fas fa-times"></i></button>
					</td>
				</tr>

				<tr v-for="(entry, i) in (participantType == 'Team') ? $store.getters.teams : $store.getters.judges" :key="i">
					<td>{{entry.name}}</td>
					<td>{{entry.emails.join(", ")}}</td>
					<td class="table-controls">
						<!-- <button><i class="fas fa-pencil-alt"></i></button> -->
						<button class="danger" @click="$store.commit('removeParticipant', { name: entry.name })"><i class="fas fa-trash-alt"></i></button>
					</td>
				</tr>
			</tbody>
		</table>

		<a :href="exportURI" class="export-helper" download="zoomkitty-participants.csv"></a>

		<csv-importer v-if="csvImporter" :callback="importerCallback"></csv-importer>
		<tabby-importer v-if="tabbyImporter" :callback="importerCallback"></tabby-importer>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import { CSVFile } from "../lib/CSVFile";

	type ParticipantType = "Team" | "Judge";

	export default Vue.extend({
		data() {
			return {
				csvImporter: false,
				displayAdd: false,
				exportURI: "",
				newParticipant: {
					name: undefined as string | undefined,
					emails: [undefined] as Array<string | undefined>,
				},
				participantType: "Team" as ParticipantType,
				tabbyImporter: false,
			};
		},

		methods: {
			addParticipant(): void {
				this.$store.commit("addParticipant", {
					name: this.newParticipant.name,
					emails: this.newParticipant.emails.filter((val) => val),
					role: this.participantType,
				});

				this.displayAdd = false;
				this.newParticipant = { name: undefined, emails: [undefined] };
			},

			clearData(): void {
				if (confirm("Are you sure you want to remove all participants? (This operation is permanent)")) {
					this.$store.commit("clearParticipants");
				}
			},

			exportData(): void {
				let rows = this.$store.state.participants.map((participant: any) => [participant.name, participant.emails.join(";"), participant.role]);
				const file = new CSVFile(["Name", "Emails", "Roles"], rows);
				this.exportURI = `data:text/csv;charset=UTF-8,${encodeURIComponent(file.toString())}`;
				// Allow attributes to update
				this.$nextTick().then(() => document.querySelector<HTMLElement>("a.export-helper")!.click());
			},

			importerCallback(values?: Record<string, string>[]): void {
				this.csvImporter = this.tabbyImporter = false;
				if (values && values.length) this.$store.commit("addParticipants", values);
			},
		},
	});
</script>

<style lang="scss">
	@import "../variables.scss";

	#participants {
		a.download-helper {
			display: none;
		}

		> table {
			width: 100%;

			.table-controls {
				width: 3rem;
			}
		}
	}
</style>

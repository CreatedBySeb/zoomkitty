<template>
	<div class="blocker">
		<div id="tabby-importer" class="modal">
			<div class="tabby-details">
				<label>URL: </label>
				<input type="text" v-model="url" placeholder="Tabbycat URL" @change="saveDetails" />
				<label>API Token: </label>
				<input type="text" v-model="token" placeholder="API Token" @change="saveDetails" />
				<button @click="importData">Import</button>
			</div>

		<div class="tab-control" v-if="participants.length">
			<label for="importer-teams" :class="participantType == 'Team' ? 'active': ''">{{$localise("general.teams")}}</label>
			<input type="radio" name="importer-teams" id="importer-teams" value="Team" v-model="participantType" />
			<label for="importer-judges" :class="participantType == 'Judge' ? 'active': ''">{{$localise("general.judges")}}</label>
			<input type="radio" name="importer-judges" id="importer-judges" value="Judge" v-model="participantType"/>
		</div>

		<table v-if="participants.length">
			<thead>
				<tr>
					<td>{{$localise("general.name")}}</td>
					<td>{{$localise("general.emails")}}</td>
				</tr>
			</thead>

			<tbody>
				<tr v-for="(entry, i) in (participantType == 'Team') ? this.teams : this.judges" :key="i">
					<td>{{entry.name}}</td>
					<td>{{entry.emails.join(", ")}}</td>
				</tr>
			</tbody>
		</table>

			<div class="button-container">
				<button @click="callback(participants)">Save</button>
				<button @click="callback([])">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import { Participant } from "../store";
	import { TabbyImporter } from "../lib/TabbyImporter";

	const url = window.localStorage.getItem("tabbyURL"),
		token = window.localStorage.getItem("tabbyToken");

	export default Vue.extend({
		data() {
			return {
				participants: [] as Participant[],
				participantType: "Team",
				token: (token != null) ? token : "",
				url: (url != null) ? url : undefined,
			};
		},

		computed: {
			feedbackText(): string {
				if (!this.url) return "Specify a Tabbycat URL";
				if (!/^http(s?):\/\//g.test(this.url)) return "URL is missing http/https from start";
				if (!/\.(\w+?)\/\w+?\/$/g.test(this.url)) return "URL is missing tournament slug";
				if (!this.token) return "Specify a Tabbycat API Token";
				return "";
			},

			judges(): Participant[] {
				return this.participants.filter((p) => p.role == "Judge");
			},

			teams(): Participant[] {
				return this.participants.filter((p) => p.role == "Team");
			},
		},

		methods: {
			importData(): void {
				if (this.feedbackText) alert(this.feedbackText);
				else {
					const importer = new TabbyImporter(this.url!, this.token);
					importer.getParticipants().then((participants) => {
						console.log(participants);
						this.participants = participants;
					});
				}
			},

			saveDetails(): void {
				if (this.url) window.localStorage.setItem("tabbyURL", this.url);
				if (this.token) window.localStorage.setItem("tabbyToken", this.token)
			},
		},

		props: {
			callback: {
				type: Function,
				required: true,
			},
		},
	});
</script>

<style lang="scss">
	#tabby-importer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		table {
			display: block;
			flex-grow: 1;
			overflow: auto;
			margin: 1rem 0;
		}

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

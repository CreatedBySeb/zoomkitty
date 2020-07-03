<template>
	<div class="blocker">
		<div id="csv-importer" class="modal">
			<input type="file" name="sourceFile" id="sourceFile" accept="text/csv" multiple="false" @change="loadFile" />

			<div class="slider-control" :class="(hasHeaders) ? 'active' : ''">
				<label for="use-headers">File has headers</label>
				<label class="slider" for="use-headers"><div class="slider-puck"></div></label>
				<input type="checkbox" name="use-headers" id="use-headers" v-model="hasHeaders" />
			</div>

			<span>Data Type:</span>

			<div class="tab-control">
				<label for="source-both" :class="(type == 'both') ? 'active' : ''">Both</label>
				<input type="radio" name="source-both" id="source-both" value="both" v-model="type" />
				<label for="source-teams" :class="(type == 'teams') ? 'active' : ''">{{$localise("general.teams")}}</label>
				<input type="radio" name="source-teams" id="source-teams" value="teams" v-model="type" />
				<label for="source-judges" :class="(type == 'judges') ? 'active' : ''">{{$localise("general.judges")}}</label>
				<input type="radio" name="source-judges" id="source-judges" value="judges" v-model="type" />
			</div>

			<div v-if="type == 'both'" class="role-values">
				<label for="role-values-judge">Judge Value:</label>
				<input type="text" name="role-values-judge" id="role-values-judge" v-model="roleValues.judge" />
				<label for="role-values-team">Team Value:</label>
				<input type="text" name="role-values-team" id="role-values-team" v-model="roleValues.team" />
			</div>

			<table v-if="csv">
				<thead>
					<tr>
						<td v-for="(key, i) in csv.keys" :key="`${i}-select`">
							<select v-model="columnTypes[key]">
								<option :value="undefined">Ignore</option>
								<option value="name">{{$localise("general.name")}}</option>
								<option value="email">{{$localise("general.emails")}}</option>
								<option value="role" v-if="type == 'both'">Role</option>
							</select>

							<input type="text" class="separator-input" placeholder="Separator" v-if="type != 'judges' && columnTypes[key] == 'email'" v-model="separators[key]" />
						</td>
					</tr>

					<tr>
						<td v-for="(key, i) in csv.keys" :key="i">{{key}}</td>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(row, i) in csv.rows" :key="`r-${i}`">
						<td v-for="(value, j) in row" :key="`${i},${j}`">{{value}}</td>
					</tr>
				</tbody>
			</table>

			<div class="button-container">
				<span class="feedback-text">{{feedbackText}}</span>
				<button @click="importData()">Import</button>
				<button @click="callback([])">Cancel</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import { CSVFile, CSVEntry } from "../lib/CSVFile";

	type ColumnType = "" | "name" | "email" | "role";
	type ImportType = "both" | "teams" | "judges";

	const fileElement = document.querySelector("#sourceFile") as HTMLInputElement;

	function splitEmails(separator: string, emails: string): string[] {
		if (separator && emails.indexOf(separator) > -1) return emails.split(separator);
		else return [emails];
	}

	function unpackArray<T>(array: (T | T[])[]): T[] {
		let out = [] as T[];

		for (let i = 0; i < array.length; i++) {
			const el = array[i];

			if (el instanceof Array) out = out.concat(el);
			else out.push(el);
		}

		return out;
	}

	export default Vue.extend({
		data() {
			return {
				columnTypes: {} as Record<string, ColumnType>,
				csv: undefined as CSVFile,
				hasHeaders: true,
				roleValues: {
					judge: "Judge",
					team: "Team",
				},
				importing: false,
				separators: {} as Record<string, string>,
				type: "both" as ImportType,
			};
		},

		computed: {
			feedbackText(): string {
				if (this.importing) return "Importing...";
				if (!this.csv) return "";
				if (!this.getColumns("name").length) return "Must specify a name column.";
				if (!this.getColumns("email").length) return "Must specify at least one email column.";
				if (this.getColumns("name").length > 1) return "Multiple name columns specified, only the first will be used.";
				if (this.type == "both" && !this.getColumns("role").length) return "Must specify a role column when importing both roles.";
				if (this.getColumns("role").length > 1) return "Multiple role columns specified, only the first will be used.";
				return "";
			},
		},

		methods: {
			getColumns(type: string): string[] {
				let keys = [] as string[];

				for (const key in this.columnTypes) {
					if (this.columnTypes[key] == type) keys.push(key);
				}

				return keys;
			},

			loadFile(event: Event): void {
				const element = event.target as HTMLInputElement;

				if (!element.files[0]) return;
				else {
					const reader = new FileReader();

					reader.addEventListener("load", (event) => {
						this.csv = CSVFile.parse(event.target.result.toString(), this.hasheaders);
					});

					reader.readAsText(element.files[0]);
				}
			},

			importData(): void {
				console.log(this.csv)
				const nameColumns = this.getColumns("name"),
					emailColumns = this.getColumns("email"),
					roleColumns = this.getColumns("role");

				if (!nameColumns.length) alert("Must have a name column.");
				else if (!emailColumns.length) alert("Must have at least one email column.");
				else if (this.type == "both" && !roleColumns.length) alert("Must have a role column when importing data for both roles.");
				else {
					this.importing = true;
					this.$nextTick().then(() => {;
						let participants = [] as CSVEntry[];

						if (this.type == "both") {
							participants = [].concat(
								this.csv
									.filterBy({ [roleColumns[0]]: this.roleValues.judge })
									.map((entry: CSVEntry) => {
										return {
											name: entry[nameColumns[0]],
											emails: unpackArray(emailColumns.map((key: string) => splitEmails(this.separators[key], entry[key]))),
											role: "Judge",
										};
									}),

								this.csv
									.filterBy({ [roleColumns[0]]: this.roleValues.team })
									.map((entry: CSVEntry) => {
										return {
											name: entry[nameColumns[0]],
											emails: unpackArray(emailColumns.map((key: string) => splitEmails(this.separators[key], entry[key]))),
											role: "Team",
										};
									}),
								);
						} else if (this.type == "judges") {
							participants = this.csv.entries.map((entry: CSVEntry) => {
								return {
									name: entry[nameColumns[0]],
									emails: unpackArray(emailColumns.map((key: string) => splitEmails(this.separators[key], entry[key]))),
									role: "Judge",
								};
							});
						} else if (this.type == "teams") {
							participants = this.csv.entries.map((entry: CSVEntry) => {
								return {
									name: entry[nameColumns[0]],
									emails: unpackArray(emailColumns.map((key: string) => splitEmails(this.separators[key], entry[key]))),
									role: "Team",
								};
							});
						} else alert("Unknown error while importing data.");

						this.callback(participants);
						this.importing = false;
					});
				}
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
	#csv-importer {
		display: flex;
		flex-direction: column;

		table {
			display: block;
			flex-grow: 1;
			overflow: auto;
			margin: 1rem 0;

			.separator-input {
				width: 4rem;
			}
		}

		.button-container {
			margin-top: auto;

			.feedback-text {
				color: #FF8F00;
			}
		}

		.role-values {
			display: flex;
			justify-content: space-evenly;
		}
	}
</style>

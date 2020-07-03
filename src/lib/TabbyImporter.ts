import { Participant, ParticipantRole } from "../store";
import { Draw } from "./Draw";

export class TabbyImporter {
	public token: string;
	public tournament: string;
	public url: string;

	constructor(url: string, token: string) {
		const tournament = /\/(\w+?)\/$/.exec(url);
		if (!tournament || !tournament[1]) throw Error("Invalid tournament in Tabbycat importer");
		else this.tournament = tournament[1];
		this.url = url.replace(`/${this.tournament}/`, "") + "/api/v1";
		this.token = token;
	}

	public getDraws(): Promise<Record<string, Draw>> {
		return this.request("GET", `/tournaments/${this.tournament}/rounds`)
			.then((body) => {
				const obj = JSON.parse(body) as any[],
					currentRounds = obj.filter((r) => !r.completed && r.draw_status == "C");

				return Promise.all(currentRounds.map((r) => {
					return this.request("GET", `${r.url}/pairings`, true)
						.then((body) => {
							const obj = JSON.parse(body);

							return Promise.all(obj.map((room: any) => {
								const judges: any[] = [].concat(room.adjudicators.chair, room.adjudicators.panellists, room.adjudicators.trainees),
									teams: any[] = room.teams.map((t: any) => t.team);

								return Promise.all([
									this.request("GET", room.venue, true)
										.then((body) => JSON.parse(body).display_name),

									Promise.all(judges.map((url) => {
										return this.request("GET", url, true)
											.then((body) => JSON.parse(body).name);
									})),

									Promise.all(teams.map((url) => {
										return this.request("GET", url, true)
											.then((body) => JSON.parse(body).short_name);
									})),
								]).then((participants: [string[], string[], string[]]) => {
									return {
										judges: participants[1],
										name: participants[0],
										teams: participants[2],
									};
								});
							}));
						}).then((draw) => [r.name, draw]);
				}));
			}).then((draws: any[]) => {
				const d: Record<string, Draw> = {};
				draws.forEach((draw) => d[draw[0]] = draw[1]);
				return d;
			}) as Promise<Record<string, Draw>>;
	}

	public getParticipant(role: ParticipantRole, id: number): Promise<Participant> {
		return this.request("GET", `/tournaments/${this.tournament}/${(role == ParticipantRole.JUDGE ? "adjudicators" : "teams")}/${id}`)
			.then((body) => {
				const obj = JSON.parse(body);

				return {
					name: obj.name,
					emails: (role == ParticipantRole.JUDGE) ? [obj.email] : obj.speakers.map((s: any) => s.email),
					role,
				};
			});
	}

	public getJudges(): Promise<Participant[]> {
		return this.request("GET", `/tournaments/${this.tournament}/adjudicators`)
			.then((body) => {
				const obj = JSON.parse(body) as any[];
				return obj.map((entry) => {
					return {
						name: entry.name,
						emails: [entry.email],
						role: "Judge",
					} as Participant;
				});
			});
	}

	public getParticipants(): Promise<Participant[]> {
		return Promise.all([this.getJudges(), this.getTeams()]).then((results) => results[0].concat(results[1]));
	}

	public getTeams(): Promise<Participant[]> {
		return this.request("GET", `/tournaments/${this.tournament}/teams`)
			.then((body) => {
				const obj = JSON.parse(body) as any[];
				return obj.map((entry) => {
					return {
						name: entry.short_name,
						emails: entry.speakers.map((speaker: any) => speaker.email),
						role: "Team",
					} as Participant;
				});
			});
	}

	private request(method: string, path: string, absolute = false): Promise<string> {
		return fetch((absolute) ? path : this.url + path, {
			credentials: "include",
			method,
			headers: {
				"Authorization": "Token " + this.token,
			},
		}).then((response) => {
			if (!response.ok) throw Error("Invalid request");
			return response.text();
		});
	}
}

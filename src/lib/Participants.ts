export interface Participant {
	name: string;
	emails: string[];
	role: "Judge" | "Team";
}

export class Participants {
	public participants = [] as Participant[];

	public get judges(): Participant[] {
		return this.participants.filter((participant) => participant.role == "Judge");
	}

	public get teams(): Participant[] {
		return this.participants.filter((participant) => participant.role == "Team");
	}

	constructor(participants: Participant[]) {
		this.participants = participants;
	}

	public clear(): void {
		this.participants = [];
		window.localStorage.removeItem("participants");
	}

	public load(): void {
		const participants = window.localStorage.getItem("participants");
		if (participants) this.participants = JSON.parse(participants);
	}

	public save(): void {
		window.localStorage.setItem("participants", JSON.stringify(this.participants));
	}
}

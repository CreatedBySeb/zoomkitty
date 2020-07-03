import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

const storedParticipants = window.localStorage.getItem("participants");

function mergeOrAdd(array: Participant[], participant: Participant): void {
	const existing = array.find((p) => p.name == participant.name);

	if (existing) {
		participant.emails.forEach((e) => {
			if (existing.emails.indexOf(e) < 0) existing.emails.push(e);
		});
	} else array.unshift(participant);
}

export interface Participant {
	name: string;
	emails: string[];
	role: ParticipantRole;
}

export enum ParticipantRole {
	JUDGE = "Judge",
	TEAM = "Team",
}

export class State {
	public participants: Participant[] = (storedParticipants) ? JSON.parse(storedParticipants) : [];
}

export interface RootStore extends Store<State> {
	getters: {
		judges: () => Participant[];
		teams: () => Participant[];
	};

	commit(type: "addParticipant", participant: Participant): void;
	commit(type: "addParticipants", participants: Participant[]): void;
	commit(type: "clearParticipants"): void;
	commit(type: "removeParticipant", target: { index: number } | { name: string }): void;
	commit(type: string, payload?: any): void;
}

export default new Vuex.Store({
	state: new State(),

	getters: {
		judges: (state): Participant[] => state.participants.filter((p) => p.role == ParticipantRole.JUDGE),
		teams: (state): Participant[] => state.participants.filter((p) => p.role == ParticipantRole.TEAM),
	},

	mutations: {
		addParticipant(state, participant: Participant): void {
			mergeOrAdd(state.participants, participant);
		},

		addParticipants(state, participants: Participant[]): void {
			participants.reverse().forEach((p) => mergeOrAdd(state.participants, p));
		},

		clearParticipants(state): void {
			state.participants = [];
		},

		removeParticipant(state, target: { index: number } | { name: string }): void {
			const index = ("index" in target) ? target.index : state.participants.findIndex((p) => p.name == target.name);
			state.participants.splice(index, 1);
		},
	},
}) as RootStore;

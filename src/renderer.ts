import "./index.scss";
import "@fortawesome/fontawesome-free/js/all";

import Vue, { VNode } from "vue";
import VueRouter from "vue-router";

import store from "./store";
import { Localiser } from "./lib/Localiser";

import App from "./App.vue";

import CSVImporter from "./components/CSVImporter.vue";
import TabbyImporter from "./components/TabbyImporter.vue";

import AboutView from "./views/About.vue";
import AllocateView from "./views/Allocate.vue";
import ParticipantsView from "./views/Participants.vue";
import WelcomeView from "./views/Welcome.vue";

export interface Participant {
	name: string;
	emails: string[];
	role: "Judge" | "Team";
}

Vue.use(VueRouter);

Vue.component("csv-importer", CSVImporter);
Vue.component("tabby-importer", TabbyImporter);

const router = new VueRouter({
	routes: [
		{
			path: "/",
			component: WelcomeView,
		},

		{
			path: "/about",
			component: AboutView,
		},

		{
			path: "/allocate",
			component: AllocateView,
		},

		{
			path: "/participants",
			component: ParticipantsView,
		},
	],
});

store.subscribe((mutation, state) => {
	if (["addParticipant", "addParticipants", "clearParticipants", "removeParticipant"].indexOf(mutation.type) > -1) {
		window.localStorage.setItem("participants", JSON.stringify(state.participants));
	}
});

const localiser = new Localiser(),
	userLang = window.localStorage.getItem("lang");

if (userLang) localiser.setLang(userLang);

Vue.prototype.$localise = localiser.localise.bind(localiser);

const app = new Vue({
	data() {
		return { localiser };
	},

	render(createElement): VNode {
		return createElement(App);
	},

	methods: {
		open(link: string): void {
			ipc.send("open", link);
		},
	},

	router,
	store,
});

app.$mount("#app");

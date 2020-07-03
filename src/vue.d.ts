import Vue from "vue";
import { RootStore } from "store";
import { Localiser } from "lib/Localiser";

declare module "vue/types/vue" {
	interface Vue {
		$localise: typeof Localiser.prototype.localiser;
		$store: typeof RootStore;
	}
}

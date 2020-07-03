const en_IE = require("../lang/en_IE.json") as Locale;

type Locale = Record<string, string>;

export class Localiser {
	public static DEFAULT_LANG = "en_IE";
	public lang = Localiser.DEFAULT_LANG;
	public locales: Record<string, Locale> = { en_IE };

	public localise(key: string, variables?: Record<string, string | number>): string {
		let template: string;

		if (key in this.locales[this.lang]) template = this.locales[this.lang][key];
		else if (key in this.locales[Localiser.DEFAULT_LANG]) template = this.locales[Localiser.DEFAULT_LANG][key];
		else return key;

		return template.replace(/\${\w+?}/g, (_str, name) => {
			if (variables && name in variables) return variables[name].toString();
			else return "${" + name + "}";
		});
	}

	public setLang(lang: string): void {
		if (lang in this.locales) this.lang = lang;
		else {
			try {
				this.locales[lang] = require(`../lang/${lang}.json`);
				this.lang = lang;
			} catch (error) {
				throw new Error(`Unable to load invalid locale '${lang}'.`);
			}
		}
	}
}

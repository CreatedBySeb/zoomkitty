import { Draw, Room } from "./Draw";

export class DrawHTMLParser {
	public draws: Record<string, Draw> = {};

	private source: string;

	constructor(source: string) {
		this.source = source
			.replace(/<![^]*?>/g, "") // Remove HTML comments
			.replace(/<i class="(emoji|adj-symbol)">[^]*?<\/i>/g, "") // Remove emojis and judge symbols
			.replace(/<(\w+?) hidden="hidden">[^]*?<\/\1>/g, "") // Remove elements with 'hidden' attribute
			.replace(/ {2,}/g, "") // Remove whitespace
			.replace(/\n/g, "") // Remove newlines
			.replace(/&amp;/g, "&"); // Restore ampersands

		const doc = new DOMParser().parseFromString(this.source, "text/html"),
			tables = doc.querySelectorAll("div[id^=tableContainer]");

		tables.forEach((container) => {
			const name = (tables.length > 1) ? container.querySelector("h4")!.innerText.trim() : doc.querySelector<HTMLElement>("div#pageTitle")!.innerText.replace(/[^\w\d\s]/g, "").trim(),
				rooms = [] as Room[];

			container.querySelectorAll("tbody>tr").forEach((row) => {
				const roomName = row.querySelector<HTMLElement>("td.venue-name span")!.innerText.trim(),
					teamNames = Array.from(row.querySelectorAll<HTMLElement>("td.team-name span")).map((el) => el.innerText.trim()),
					judgeNames = Array.from(row.querySelectorAll<HTMLElement>("td:last-of-type span span"))
						.map((el) => el.innerText)
						.filter((text) => text != ", ");

				rooms.push({
					name: roomName,
					judges: judgeNames,
					teams: teamNames,
				});
			});

			this.draws[name] = rooms;
		});
	}
}

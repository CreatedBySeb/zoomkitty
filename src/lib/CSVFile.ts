function escapeComma(string: string): string {
	return (string.indexOf(",") > -1) ? `"${string}"` : string;
}

function fixSplit(array: string[]): string[] {
	let quoted = false,
		quoteIndex = -1;

	for (let i = 0; i < array.length; i++) {
		if (array[i].startsWith('"')) {
			quoted = true;
			quoteIndex = i;
		} else if (quoted && array[i].endsWith('"')) {
			quoted = false;

			const newEl = array
				.slice(quoteIndex, i - quoteIndex + 1)
				.join(",")
				.slice(1, -1);

			array.splice(quoteIndex, i - quoteIndex + 1, newEl);

			i = quoteIndex + 1;
		}
	}

	return array;
}

export type CSVEntry = Record<string, string>;

export class CSVFile {
	public static parse(source: string, hasHeaders: boolean = true): CSVFile {
		const lines = source.trim().split("\n");
		let headers = [] as string[];

		if (hasHeaders) headers = fixSplit(lines.splice(0, 1)[0].split(","));

		return new CSVFile(headers, lines.map((line) => fixSplit(line.split(","))));
	}

	public keys?: string[]
	public rows: string[][];

	public get entries(): CSVEntry[] {
		return this.rows.map((row) => this.getEntry(row));
	}

	constructor(keys: string[] | undefined, rows: string[][]) {
		if (keys) this.keys = keys.map((k) => k.trim());
		this.rows = rows.map((r) => r.map((e) => e.trim()));
	}

	public filterBy(query: CSVEntry): CSVEntry[] {
		if (!this.keys) throw Error("Unable to query filter for keyless data.");
		let entries = this.entries.concat([]);

		for (const key in query) {
			if (this.keys.indexOf(key) > -1) {
				entries = entries.filter((entry) => {
					return entry[key] == query[key];
				});
			}
		}

		return entries;
	}

	public sort(func: (a: CSVEntry, b: CSVEntry) => number): CSVEntry[] {
		this.rows = this.rows.sort((a, b) => func(this.getEntry(a), this.getEntry(b)));
		return this.entries;
	}

	public toString(): string {
		let output = "";

		if (this.keys) output += this.keys.map(escapeComma).join(",") + "\n";

		output += this.rows
			.map((row) => row.map(escapeComma).join(","))
			.join("\n");

		return output.trim();
	}

	private getEntry(row: string[]): CSVEntry {
		if (!this.keys) throw Error("Unable to generate entry from keyless data.");
		const entry = {} as CSVEntry;
		this.keys.forEach((key, i) => entry[key] = row[i]);
		return entry;
	}
}

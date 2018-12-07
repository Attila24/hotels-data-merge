export class Util {
	static trimOrEmpty(str: string): string {
		return str ? str.trim() : '';
	}

	static removeSpace(str: string): string {
		return str.replace(/\s/g, '');
	}

	static removeSpaceFromArray(arr: string[]): string[] {
		return arr ? arr.map(Util.removeSpace) : [];
	}

}
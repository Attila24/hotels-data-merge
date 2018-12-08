/**
 * A class that contains various utility methods for the application.
 */
export class Util {

	/**
	 * If the parameter string is empty, returns empty string.
	 * Otherwise returns a trimmed version of the string.
	 * @param str
	 */
	static trimOrEmpty(str: string): string {
		return str ? str.trim() : '';
	}

	/**
	 * Removes the space characters from the parameter string.
	 * @param str
	 */
	static removeSpace(str: string): string {
		return str.replace(/\s/g, '');
	}

	/**
	 * Removes the space characters from all of the strings stored in an array.
	 * @param arr
	 */
	static removeSpaceFromArray(arr: string[]): string[] {
		return arr ? arr.map(Util.removeSpace) : [];
	}
}
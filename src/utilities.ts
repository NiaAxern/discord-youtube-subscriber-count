/** @format */


// I wrote a function this like way back ago but I lost it so this is now written by bing AI.
// tbf this looks way better than my old code :)
export function formatLargeNumber(input: string) {
	if (!input || input == null) return null;
	// Extract the numeric part from the input string
	const numericString: string | undefined = input.match(/\d+(\.\d+)?/)?.[0];
	if (!numericString) return null;

	// Convert the numeric string to a number
	const numericValue = parseFloat(numericString);

	// Multiply by the appropriate factor based on the suffix (e.g., "M" for million)
	const suffix = input.slice(-1).toUpperCase();
	let multiplier = 1;
	if (suffix === 'K') {
		multiplier = 1e3; // 1 million
	} else if (suffix === 'M') {
		multiplier = 1e6; // 1 million
	} else if (suffix === 'B') {
		multiplier = 1e9; // 1 billion
	} // Add more cases for other suffixes if needed

	// Calculate the final formatted value
	const formattedValue = numericValue * multiplier;

	return formattedValue;
}

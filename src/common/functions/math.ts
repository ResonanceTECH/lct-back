export function roundToDecimal(amount: number, decimalPlaces: number = 2) {
	const multiplier = 10 ** decimalPlaces;
	return Math.round(multiplier * amount) / multiplier;
}

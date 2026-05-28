const UNICODE_FRACTIONS: Record<string, number> = {
	'¼': 0.25,
	'½': 0.5,
	'¾': 0.75,
	'⅓': 1 / 3,
	'⅔': 2 / 3,
	'⅛': 0.125,
	'⅜': 0.375,
	'⅝': 0.625,
	'⅞': 0.875,
	'⅕': 0.2,
	'⅖': 0.4,
	'⅗': 0.6,
	'⅘': 0.8,
	'⅙': 1 / 6,
	'⅚': 5 / 6
};

const SNAP_FRACTIONS: [number, string][] = [
	[1 / 8, '⅛'],
	[1 / 6, '⅙'],
	[1 / 5, '⅕'],
	[1 / 4, '¼'],
	[1 / 3, '⅓'],
	[3 / 8, '⅜'],
	[2 / 5, '⅖'],
	[1 / 2, '½'],
	[3 / 5, '⅗'],
	[2 / 3, '⅔'],
	[3 / 4, '¾'],
	[4 / 5, '⅘'],
	[5 / 6, '⅚'],
	[7 / 8, '⅞']
];

const UNICODE_FRAC_CHARS = Object.keys(UNICODE_FRACTIONS).join('');
const QTY_RE = new RegExp(
	`^(\\d+\\s+\\d+\\/\\d+|\\d+[${UNICODE_FRAC_CHARS}]|\\d+\\/\\d+|[${UNICODE_FRAC_CHARS}]|\\d+(?:\\.\\d+)?)(?=\\s|$)`
);

function parseQuantityStr(q: string): number {
	const mixedAscii = q.match(/^(\d+)\s+(\d+)\/(\d+)$/);
	if (mixedAscii)
		return parseInt(mixedAscii[1]) + parseInt(mixedAscii[2]) / parseInt(mixedAscii[3]);
	const mixedUnicode = q.match(new RegExp(`^(\\d+)([${UNICODE_FRAC_CHARS}])$`));
	if (mixedUnicode) return parseInt(mixedUnicode[1]) + UNICODE_FRACTIONS[mixedUnicode[2]];
	const asciiFrac = q.match(/^(\d+)\/(\d+)$/);
	if (asciiFrac) return parseInt(asciiFrac[1]) / parseInt(asciiFrac[2]);
	if (UNICODE_FRACTIONS[q] !== undefined) return UNICODE_FRACTIONS[q];
	return parseFloat(q);
}

function formatQuantity(value: number): string {
	if (value <= 0) return '';
	const whole = Math.floor(value);
	const frac = value - whole;
	if (frac < 0.01) return whole.toString();
	for (const [fracVal, symbol] of SNAP_FRACTIONS) {
		if (Math.abs(frac - fracVal) < 0.05) {
			return whole > 0 ? `${whole}${symbol}` : symbol;
		}
	}
	return value % 1 === 0 ? value.toString() : value.toFixed(1);
}

export function scaleIngredient(ingredient: string, scale: number): string {
	if (scale === 1) return ingredient;
	// Handle dual-unit format: "800g / 28 oz text" or "60g / 4 tbsp text"
	// Requires a unit letter between the first number and the "/" to avoid
	// matching ASCII fractions like "1/2 cup".
	const dualMatch = ingredient.match(
		/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)(\s*\/\s*)(\d+(?:\.\d+)?)(.*)/
	);
	if (dualMatch) {
		const [, num1, unit1, sep, num2, rest] = dualMatch;
		return `${formatQuantity(parseFloat(num1) * scale)}${unit1}${sep}${formatQuantity(parseFloat(num2) * scale)}${rest}`;
	}
	// Metric-only: "225ml chicken stock" or "85g cheese"
	// No \s* between number and unit — avoids matching "2 skinless chicken breasts"
	const metricMatch = ingredient.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)(.*)/);
	if (metricMatch) {
		const [, num, unit, rest] = metricMatch;
		return `${formatQuantity(parseFloat(num) * scale)}${unit}${rest}`;
	}
	const match = ingredient.match(QTY_RE);
	if (!match) return ingredient;
	const original = match[1];
	const scaled = parseQuantityStr(original) * scale;
	return formatQuantity(scaled) + ingredient.slice(original.length);
}

export function formatMultiplier(m: number): string {
	const whole = Math.floor(m);
	const frac = m - whole;
	const fracStr = frac > 0.4 && frac < 0.6 ? '½' : '';
	return (whole > 0 ? `${whole}` : '') + fracStr + '×';
}

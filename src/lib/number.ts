class BigMath {
	static abs(x: bigint) {
		return x < 0n ? -x : x;
	}
	static sign(x: bigint) {
		if (x === 0n) {
			return 0n;
		}
		return x < 0n ? -1n : 1n;
	}
	static pow(base: bigint, exponent: bigint) {
		return base ** exponent;
	}
	static min(value: bigint, ...values: bigint[]) {
		for (const v of values) {
			if (v < value) {
				value = v;
			}
		}
		return value;
	}
	static max(value: bigint, ...values: bigint[]) {
		for (const v of values) {
			if (v > value) {
				value = v;
			}
		}
		return value;
	}

	static toFixed(value: bigint, decimalPlaces: number): string {
		if (decimalPlaces < 0) {
			throw new Error("Decimal places must be a non-negative integer.");
		}

		const valueStr = value.toString();

		if (decimalPlaces === 0) {
			return valueStr;
		}

		const integerPart = valueStr.length;

		let result = valueStr;

		if (integerPart < decimalPlaces) {
			result = "0." + "0".repeat(decimalPlaces - integerPart) + valueStr;
		} else {
			result =
				valueStr.slice(0, integerPart - decimalPlaces) +
				"." +
				valueStr.slice(integerPart - decimalPlaces);
		}

		return result;
	}
}

// Pmt function calculates loan.
export function pmt(
	rate: number,
	nper: number,
	pv: number,
	fv: number = 0,
	type: number = 0,
): number {
	if (rate === 0) {
		return -(pv + fv) / nper;
	}

	const pvif = Math.pow(1 + rate, nper);
	let pmt = (rate / (pvif - 1)) * -(pv * pvif + fv);

	if (type === 1) {
		pmt /= 1 + rate;
	}

	return Number(Math.abs(pmt).toFixed(2));
}

export function pmtBigint(
	rate: number,
	nper: number,
	pv: bigint,
	fv: number = 0,
	type: number = 0,
): bigint {
	if (rate === 0) {
		return -(pv + BigInt(fv)) / BigInt(nper);
	}

	const pvif = Math.pow(1 + rate, nper);
	let pmt: bigint =
		(BigInt(rate) / (BigInt(pvif) - 1n)) *
		-(pv * BigInt(pvif) + BigInt(fv));

	if (type === 1) {
		pmt /= 1n + BigInt(rate);
	}

	return BigInt(BigMath.toFixed(BigMath.abs(pmt), 2));
}

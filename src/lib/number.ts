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
	fv: bigint = 0n,
	type: number = 0,
): bigint {
	if (rate === 0) {
		return -(pv + fv) / BigInt(nper);
	}

	const pvif = Math.pow(1 + rate, nper);
	const bigPvif = BigInt(Math.round(pvif * 1e12));

	let pmt =
		((pv * bigPvif + fv * BigInt(1e12)) * BigInt(rate * 1e12)) /
		(bigPvif - BigInt(1e12));

	if (type === 1) {
		pmt = pmt / BigInt(1e12 + rate * 1e12);
	}

	return BigInt(pmt) / BigInt(1e12);
}

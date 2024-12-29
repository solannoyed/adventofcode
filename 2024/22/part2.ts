export default function (input: string) {
	const secrets = input
		.trim()
		.split('\n')
		.map((val) => BigInt(val));

	const bananas: number[][][][] = [];
	for (let c0 = 0; c0 < 19; c0++) {
		bananas.push([]);
		for (let c1 = 0; c1 < 19; c1++) {
			bananas[c0].push([]);
			for (let c2 = 0; c2 < 19; c2++) {
				bananas[c0][c1].push([]);
				for (let c3 = 0; c3 < 19; c3++) {
					bananas[c0][c1][c2].push(0);
				}
			}
		}
	}

	for (let s = 0; s < secrets.length; s++) {
		// these are the bananas just for this secret
		const b: number[][][][] = [];
		for (let c0 = 0; c0 < 19; c0++) {
			b.push([]);
			for (let c1 = 0; c1 < 19; c1++) {
				b[c0].push([]);
				for (let c2 = 0; c2 < 19; c2++) {
					b[c0][c1].push([]);
					for (let c3 = 0; c3 < 19; c3++) {
						b[c0][c1][c2].push(0);
					}
				}
			}
		}

		const seq: number[] = [];
		for (let i = 0; i < 2000; i++) {
			const next = nextSecret(secrets[s]);
			// add 9 and use Number, so that we can use the diff as an index
			const diff = Number((next % 10n) - (secrets[s] % 10n) + 9n);
			seq.push(diff);
			secrets[s] = next;

			if (seq.length < 4 || b[seq.at(-4)!][seq.at(-3)!][seq.at(-2)!][seq.at(-1)!] !== 0) continue;

			b[seq.at(-4)!][seq.at(-3)!][seq.at(-2)!][seq.at(-1)!] = Number(secrets[s] % 10n);
		}

		// merge into the total bananas
		for (let c0 = 0; c0 < 19; c0++) {
			for (let c1 = 0; c1 < 19; c1++) {
				for (let c2 = 0; c2 < 19; c2++) {
					for (let c3 = 0; c3 < 19; c3++) {
						bananas[c0][c1][c2][c3] += b[c0][c1][c2][c3];
					}
				}
			}
		}
	}

	let result = 0;
	for (let c0 = 0; c0 < 19; c0++) {
		for (let c1 = 0; c1 < 19; c1++) {
			for (let c2 = 0; c2 < 19; c2++) {
				for (let c3 = 0; c3 < 19; c3++) {
					if (bananas[c0][c1][c2][c3] > result) {
						result = bananas[c0][c1][c2][c3];
					}
				}
			}
		}
	}
	return result;
}

function nextSecret(secret: bigint) {
	secret = ((secret * 64n) ^ secret) % 16777216n;
	secret = ((secret / 32n) ^ secret) % 16777216n;
	secret = ((secret * 2048n) ^ secret) % 16777216n;
	return secret;
}

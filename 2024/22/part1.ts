export default function (input: string) {
	const secrets = input
		.trim()
		.split('\n')
		.map((val) => BigInt(val));

	for (let i = 0; i < 2000; i++) for (let s = 0; s < secrets.length; s++) secrets[s] = nextSecret(secrets[s]);

	return Number(secrets.reduce((accumulator, value) => accumulator + value, 0n));
}

function nextSecret(secret: bigint) {
	secret = ((secret * 64n) ^ secret) % 16777216n;
	secret = ((secret / 32n) ^ secret) % 16777216n;
	secret = ((secret * 2048n) ^ secret) % 16777216n;
	return secret;
}

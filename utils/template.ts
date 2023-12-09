/**
 * @file TypeScript Template Scaffolder
 * @author solannoyed
 *
 * @description Copy the TypeScript template for the desired date/s
 * @example `bun utils/template.ts 2023/01`
 * @example `bin utils/template.ts 2015/01 2015/02`
 */

import { mkdir } from 'node:fs/promises';
import config from '../templates/typescript/config.json';

// TODO: should this be moved elsewhere?
declare module 'bun' {
	interface Env {
		COOKIE: string | undefined;
	}
}

const currentDate = new Date();

const dates = Bun.argv
	.map((arg) => arg.match(/^(20\d{2})\/(\d{2})$/))
	.filter((match) => match != null)
	.map((match) => match!)
	.filter(([path, year, day]) => {
		const aocDate = new Date(`${year}-12-${day}Z-5`);
		// AoC started in 2015 and runs from 01-25 of December
		if (currentDate < aocDate || year < '2015' || day < '01' || day > '25') {
			console.error('Invalid puzzle:', path);
			return false;
		}
		return true;
	})
	.map(([path, year, day]) => {
		return {
			path: path,
			url: `https://adventofcode.com/${year}/day/${parseInt(day)}`
		};
	});
if (dates.length == 0) {
	console.error(
		'Please use at least one command line argument for a valid AoC day, in the format `YYYY/DD`'
	);
	process.exit();
}

for (const date of dates) {
	console.info('Scaffolding template', date.path);

	await mkdir(date.path, { recursive: true });
	for (const file of config.files) {
		const source = Bun.file(`templates/typescript/${file.source}`);
		const destination = Bun.file(`${date.path}/${file.destination}`);
		// using `.exists()` on `destination` causes an empty file to be written with `Bun.write(destination, source)`. Possibly a bug in Bun when copying two `BunFile`s
		if (source.lastModified < 0) {
			console.warn('- File missing:', source.name, '(skipping)');
			continue;
		} else if (destination.lastModified > 0) {
			console.warn('- File exists:', destination.name, '(skipping)');
			continue;
		}
		await Bun.write(destination, source);
	}

	const input = Bun.file(`${date.path}/input.txt`);
	if (await input.exists()) {
		console.warn('- File exists:', input.name, '(skipping)');
		continue;
	}
	if (Bun.env.COOKIE == undefined) {
		console.error('- Cookie environment variable missing');
		continue;
	}
	let response = await fetch(`${date.url}/input`, {
		headers: new Headers({ Cookie: Bun.env.COOKIE! })
	});
	if (!response.ok) {
		console.error(
			'Could not fetch input:',
			response.status,
			response.statusText,
			await response.text()
		);
		continue;
	}
	Bun.write(input, response);
}
console.info('Finished');

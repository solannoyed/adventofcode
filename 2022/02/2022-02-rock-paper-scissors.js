import { readFileSync } from "fs";

const LROCK = 'A', LPAPER = 'B', LSCISSORS = 'C';
const RROCK = 'X', RPAPER = 'Y', RSCISSORS = 'Z';

const SWIN = 6, SDRAW = 3, SLOSE = 0;
const SROCK = 1, SPAPER = 2, SSCISSORS = 3;

var getScore = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let rounds = data.split('\n').map(val => val.split(' '));

	let score = 0;
	for (const round of rounds) {
		if (round[1] === RROCK) {
			score += 1;
			if (round[0] === LROCK) score += 3;
			else if (round[0] === LSCISSORS) score += 6;
		} else if (round[1] === RPAPER) {
			score += 2;
			if (round[0] === LPAPER) score += 3;
			else if (round[0] === LROCK) score += 6;
		} else if (round[1] === RSCISSORS) {
			score += 3;
			if (round[0] === LSCISSORS) score += 3;
			else if (round[0] === LPAPER) score += 6;
		}
	}
	console.log(score);
}

// getScore('./2022-02-rock-paper-scissors.txt');

const LLOSE = 'X', LDRAW = 'Y', LWIN = 'Z';

var getScore2 = function(filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let rounds = data.split('\n').map(val => val.split(' '));

	let score = 0;
	for (const round of rounds) {
		if (round[0] === LROCK) {
			if (round[1] === LLOSE) score += SSCISSORS + SLOSE;
			else if (round[1] === LDRAW) score += SROCK + SDRAW;
			else score += SPAPER + SWIN;
		} else if (round[0] === LPAPER) {
			if (round[1] === LLOSE) score += SROCK + SLOSE;
			else if (round[1] === LDRAW) score += SPAPER + SDRAW;
			else score += SSCISSORS + SWIN;
		} else if (round[0] === LSCISSORS) {
			if (round[1] === LLOSE) score += SPAPER + SLOSE;
			else if (round[1] === LDRAW) score += SSCISSORS + SDRAW;
			else score += SROCK + SWIN;
		}
	}
	console.log(score);
}
getScore2('./2022-02-rock-paper-scissors.txt');

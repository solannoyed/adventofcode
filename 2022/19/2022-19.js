import { readFileSync } from 'fs';

const WAITING = {
	NONE: 0,
	ORE: 1,
	CLAY: 2,
	OBSIDIAN: 3,
	GEODE: 4
};
const MAX_GEODES = [
	0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210, 231, 253, 276, 300, 325, 351,
	378, 406, 435, 465, 496
];

var getAnswer = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let blueprints = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			let res = line.replace('Blueprint ', '');
			res = res.replace(': Each ore robot costs ', ',');
			res = res.replace(' ore. Each clay robot costs ', ',');
			res = res.replace(' ore. Each obsidian robot costs ', ',');
			res = res.replace(' ore and ', ',');
			res = res.replace(' clay. Each geode robot costs ', ',');
			res = res.replace(' ore and ', ',');
			res = res.replace(' obsidian.', '');
			res = res.split(',').map((val) => parseInt(val));
			let blueprint = {
				id: res[0],
				ore_robot_ore: res[1],
				clay_robot_ore: res[2],
				obsidian_robot_ore: res[3],
				obsidian_robot_clay: res[4],
				geode_robot_ore: res[5],
				geode_robot_obsidian: res[6],

				max_ore: Math.max(res[2], res[3], res[5]), // this is excluding the ore robot cost, because we dont want to have to wait for it if we have everything else
				// double_max_ore: 2 * Math.max(res[1], res[2], res[3], res[5]),
				// max_ore: Math.max(res[1], res[2], res[3], res[5]),
				// sum_ore: res[1] + res[2] + res[3] + res[5],
				sum_ore: res[2] + res[3] + res[5],

				ore_robots: 1,
				clay_robots: 0,
				obsidian_robots: 0,
				geode_robots: 0,

				ore: 0,
				clay: 0,
				obsidian: 0,
				geode: 0,

				minute: 0,
				order: '',
				waiting: WAITING.NONE
			};
			return blueprint;
		});
	// return blueprints;

	// return getMaxGeodeCountGreedy(blueprints[1]);
	// return getMaxGeodeCountDFS(blueprints[1]);

	let result = 0;

	for (const blueprint of blueprints) {
		let max = getMaxGeodeCountDFS(blueprint);
		// console.log(max);
		// return 0;
		result += max.id * max.geode;
	}

	return result;
};

// be greedy and just make the geode if we have enough. this could prove wrong if making an obsidian over this could allow us to have two of them sooner and therefore a larger total at the end (?)
var getMaxGeodeCountGreedy = function (bp) {
	// ideal ratio:
	// g_ob *
	for (let minute = 0; minute < 24; minute++) {
		console.log('== Minute', minute + 1, '==');
		bp.ore += bp.ore_robots;
		bp.clay += bp.clay_robots;
		bp.obsidian += bp.obsidian_robots;
		bp.geode += bp.geode_robots;

		let summary = [
			`${bp.ore_robots} ore-collecting robots; you now have`,
			`${bp.clay_robots} clay-collecting robots; you now have`,
			`${bp.obsidian_robots} obsidian-collecting robots; you now have`,
			`${bp.geode_robots} geode-collecting robots; you now have`
		];

		let building = false; // we can only build max one per minute
		// ---- GEODE ROBOT
		if (
			bp.ore - bp.ore_robots >= bp.geode_robot_ore && // cant build if we dont have enough materials
			bp.obsidian - bp.obsidian_robots >= bp.geode_robot_obsidian // cant build if we dont have enough materials
		) {
			bp.ore -= bp.geode_robot_ore;
			bp.obsidian -= bp.geode_robot_obsidian;
			bp.geode_robots++;
			building = true;
			console.log(
				`Spend ${bp.geode_robot_ore} ore and ${bp.geode_robot_obsidian} obsidian to build a geode-collecting robot.`
			);
		}
		// ---- OBSIDIAN ROBOT
		if (
			!building && // cant build more than one thing at a time
			bp.obsidian_robots < bp.geode_robot_obsidian && // no point making more if we have enough per turn for anything
			bp.ore - bp.ore_robots >= bp.obsidian_robot_ore && // cant build if we dont have enough materials
			bp.clay - bp.clay_robots >= bp.obsidian_robot_clay // cant build if we dont have enough materials
		) {
			// if waiting would get us a geode quicker than building another obsidian, we should wait
			if (
				(bp.geode_robot_obsidian - bp.obsidian) * bp.ore_robots >
				(bp.geode_robot_ore + bp.obsidian_robot_ore - bp.ore) * bp.obsidian_robots
			) {
				bp.ore -= bp.obsidian_robot_ore;
				bp.clay -= bp.obsidian_robot_clay;
				bp.obsidian_robots++;
				building = true;
				console.log(
					`Spend ${bp.obsidian_robot_ore} ore and ${bp.obsidian_robot_clay} clay to build an obsidian-collecting robot.`
				);
			}
		}
		// ---- CLAY ROBOT
		if (
			!building && // cant build more than one thing at a time
			bp.clay_robots < bp.obsidian_robot_clay && // no point making more if we have enough per turn for anything
			bp.ore - bp.ore_robots >= bp.clay_robot_ore // cant build if we dont have enough materials
		) {
			// if building a clay would get us enough to build another obsidian earlier than just waiting, do it
			if (
				(bp.obsidian_robot_clay - bp.clay) * bp.ore_robots >
				(bp.obsidian_robot_ore + bp.clay_robot_ore - bp.ore) * bp.clay_robots
			) {
				bp.ore -= bp.clay_robot_ore;
				bp.clay_robots++;
				building = true;
				console.log(`Spend ${bp.clay_robot_ore} ore to build a clay-collecting robot.`);
			}
		}
		// ---- ORE ROBOT
		if (
			!building && // cant build more than one thing at a time
			bp.ore_robots < bp.max_ore && // no point making more if we have enough per turn for anything
			bp.ore - bp.ore_robots >= bp.ore_robot_ore // cant build if we dont have enough materials
		) {
			// make sure that building another ore does not delay other things
			bp.ore -= bp.ore_robot_ore;
			bp.ore_robots++;
			building = true;
			console.log(`Spend ${bp.ore_robot_ore} ore to build an ore-collecting robot.`);
		}
		console.log(summary[0], bp.ore, 'ore');
		if (bp.clay_robots) console.log(summary[1], bp.clay, 'clay');
		if (bp.obsidian_robots) console.log(summary[2], bp.obsidian, 'obsidian');
		if (bp.geode_robots) console.log(summary[3], bp.geode, 'geode');
	}
	return bp;
};

var getMaxGeodeCountDFS = function (blueprint, minutes = 24) {
	const startTime = performance.now();
	let stack = [blueprint];
	let bp;
	// let tmp;
	let maxBp;
	// let maxZeroGeodeMinute;
	while (stack.length > 0) {
		bp = stack.pop();
		// add the resources, but we will have to deduct this if we make a robot
		bp.ore += bp.ore_robots;
		bp.clay += bp.clay_robots;
		bp.obsidian += bp.obsidian_robots;
		bp.geode += bp.geode_robots;

		bp.minute++;
		if (bp.minute >= minutes) {
			// console.log('test'); return;
			bp.order += '.'; // dont build or wait for anything on the last minute
			// if (bp.geode > 0) console.log('test');
			if (!maxBp || maxBp.geode < bp.geode) maxBp = bp;
			// console.log(bp);
			continue;
		}
		// if we are deep enough in to get some production, but we cant possibly beat our current max, dont bother continuing
		if (maxBp && bp.minute >= 20) {
			//} && bp % 4 === 0) { // if these checks are 'expensive' we might only want to do it every few minutes
			// console.log('test2');
			// if (bp.geode === 0) continue; // if we have no geode robots, we've probably already failed (actually though? got no result on one of the things, might need to increase the number... increased number just below)
			// if we cant possibly beat our current max, dont bother continuing
			if (bp.geode + bp.geode_robots * (minutes - bp.minute) + MAX_GEODES[minutes - 0 - bp.minute] <= maxBp.geode)
				continue;
		}
		// if (maxBp && bp.minute > 23 && bp.geode === 0) continue;
		//                     . . C . C . - - O . C B - O C C B O G B O G O .
		//                     . . C . C . C . . . B C . . B . . G . . G . . .
		// if (bp.order ===      '. . C . C . C . . . B C . . B . . G . . G . . .') console.log('1');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . G . . G . . ') console.log('2');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . G . . G . ') console.log('3');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . G . . G ') console.log('4');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . G . . ') console.log('5');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . G . ') console.log('6');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . G ') console.log('7');
		// else if (bp.order === '. . C . C . C . . . B C . . B . . ') console.log('8');
		// else if (bp.order === '. . C . C . C . . . B C . . B . ') console.log('9');
		// else if (bp.order === '. . C . C . C . . . B C . . B ') console.log('10');
		// else if (bp.order === '. . C . C . C . . . B C . . ') console.log('11');
		// else if (bp.order === '. . C . C . C . . . B C . ') console.log('12');
		// else if (bp.order === '. . C . C . C . . . B C ') console.log('13');
		// else if (bp.order === '. . C . C . C . . . B ') console.log('14');
		// else if (bp.order === '. . C . C . C . . . ') console.log('15');
		// else if (bp.order === '. . C . C . C . . ') console.log('16');
		// else if (bp.order === '. . C . C . C . ') console.log('17');

		let built = false;
		if (bp.waiting === WAITING.NONE || bp.waiting === WAITING.GEODE) {
			// if we aren't waiting on something else, consider making a geode robot
			if (bp.obsidian - bp.obsidian_robots >= bp.geode_robot_obsidian && bp.ore - bp.ore_robots >= bp.geode_robot_ore) {
				// if we have enough to build geode
				built = true;
				let tmp = { ...bp };
				tmp.obsidian -= tmp.geode_robot_obsidian;
				tmp.ore -= tmp.geode_robot_ore;
				tmp.geode_robots++;
				tmp.waiting = WAITING.NONE;
				tmp.order += 'G ';
				stack.push(tmp);
				// continue; // this is greedy, but we probably want to do this every chance we can
			} else if (bp.obsidian_robots > 0) {
				// if we have some obsidian production, consider waiting until we can afford to build one
				let tmp = { ...bp };
				tmp.waiting = WAITING.GEODE;
				tmp.order += '- ';
				stack.push(tmp);
			}
		}
		// if ( // we are producing enough to make geode every minute, skip the rest, it can only slow us down if we build anything else
		// 	bp.ore - bp.ore_robots >= bp.geode_robot_ore &&
		// 	bp.obsidian - bp.obsidian_robots >= bp.geode_robot_obsidian &&
		// 	bp.ore_robots >= bp.geode_robot_ore &&
		// 	bp.obsidian_robots >= bp.geode_robot_obsidian
		// ) continue;

		if (
			bp.obsidian_robots <= bp.geode_robot_obsidian &&
			(bp.waiting === WAITING.NONE || bp.waiting === WAITING.OBSIDIAN)
		) {
			// if we have less than ideal obsidian production and aren't waiting on something else, consider making one
			if (bp.clay - bp.clay_robots >= bp.obsidian_robot_clay && bp.ore - bp.ore_robots >= bp.obsidian_robot_ore) {
				// if we have enough resources to make one
				built = true;
				let tmp = { ...bp };
				tmp.clay -= tmp.obsidian_robot_clay;
				tmp.ore -= tmp.obsidian_robot_ore;
				tmp.obsidian_robots++;
				tmp.waiting = WAITING.NONE;
				tmp.order += 'B ';
				stack.push(tmp);
			} else if (bp.clay_robots > 0) {
				// if we have some clay production, consider waiting until we can afford to build one
				let tmp = { ...bp };
				tmp.waiting = WAITING.OBSIDIAN;
				tmp.order += '- ';
				stack.push(tmp);
			}
		}
		if (bp.clay_robots <= bp.obsidian_robot_clay && (bp.waiting === WAITING.NONE || bp.waiting === WAITING.CLAY)) {
			// if we have less than ideal clay production and aren't waiting on something else, consider making one
			if (bp.ore - bp.ore_robots >= bp.clay_robot_ore) {
				// if (bp.order === '. . C . C . ') console.log('test 1');
				// else if (bp.order === '. . C . C . C . . . B ') console.log('test 2');
				// if we have enough resources to make one
				built = true;
				let tmp = { ...bp };
				tmp.ore -= tmp.clay_robot_ore;
				tmp.clay_robots++;
				tmp.waiting = WAITING.NONE;
				tmp.order += 'C ';
				stack.push(tmp);
			} else {
				// consider waiting until we can afford to build one
				let tmp = { ...bp };
				tmp.waiting = WAITING.CLAY;
				tmp.order += '- ';
				stack.push(tmp);
			}
		}
		if (bp.ore_robots <= bp.max_ore && (bp.waiting === WAITING.NONE || bp.waiting === WAITING.ORE)) {
			// if we have less than ideal ore production and aren't waiting on something else, consider making one
			if (bp.ore - bp.ore_robots >= bp.ore_robot_ore) {
				// if we have enough resources to make one
				built = true;
				let tmp = { ...bp };
				tmp.ore -= tmp.ore_robot_ore;
				tmp.ore_robots++;
				tmp.waiting = WAITING.NONE;
				tmp.order += 'O ';
				stack.push(tmp);
			} else {
				// consider waiting until we can afford to build one
				let tmp = { ...bp };
				tmp.waiting = WAITING.ORE;
				tmp.order += '- ';
				stack.push(tmp);
			}
		}
		if (!built && bp.waiting === WAITING.NONE) {
			// if (bp.order === '. . C . C . C . ') console.log('17');
			// if we didn't build anything and aren't waiting on something, it means we couldn't afford anything, so we should wait
			let tmp = { ...bp };
			tmp.order += '. ';
			stack.push(tmp);
		}
		continue; // with additional checks and waiting additions, we shouldn't have to look further into whether or not to wait (I think)
		// . . C . C . C . . . B C . . B . . G . . G . . .
		// . . C . C . C . - - B C . - B . - G C . G . - .
		if (
			// !built || // if we haven't built anything, we should wait
			bp.ore - bp.ore_robots < Math.max(bp.ore_robot_ore, bp.clay_robot_ore) || // if we don't have enough ore for either ore/clay robots we should wait
			(bp.clay_robots > 0 &&
				(bp.ore - bp.ore_robots < bp.obsidian_robot_ore || bp.clay - bp.clay_robots < bp.obsidian_robot_clay)) || // if we have clay production but not enough ore or clay for obsidian robot
			(bp.obsidian_robots > 0 &&
				(bp.ore - bp.ore_robots < bp.geode_robot_ore || bp.obsidian - bp.obsidian_robots < bp.geode_robot_obsidian)) // if we have obsidian production but not enough ore or clay for geode robot
		) {
			bp.order += '- ';
			stack.push(bp);
		}
		continue;

		if (bp.ore - bp.ore_robots < bp.min_ore) {
			stack.push(bp);
			continue;
		}
		continue;
		// the point of waiting is if we dont have enough for anything, or if we are saving for something
		// saving to build ore
		//  - not enough ore to build ore
		//  - not enough production for one of the max each minute
		// saving to build clay
		//  - not enough ore to build clay
		//  - not enough production for an obsidian every minute
		// saving to build obsidian
		//  - not enough to build

		// if (bp.ore - bp.ore_robots < bp.max_ore + 2 || bp.clay - bp.clay_robots < bp.obsidian_robot_clay || bp.obsidian - bp.obsidian_robots < bp.geode_robot_obsidian) {
		if (bp.ore <= bp.max_ore || bp.ore <= bp.ore_robot_ore) {
			bp.order += '- ';
			stack.push(bp);
		}

		// reasons we should NOT wait
		if (
			// we have enough to build whatever we want
			bp.ore - bp.ore_robots >= bp.max_ore &&
			bp.clay - bp.clay_robots >= bp.obsidian_robot_clay &&
			bp.obsidian - bp.obsidian_robots >= bp.geode_robot_obsidian
		)
			continue;

		// if (bp.)
		// if (bp.ore - bp.ore_robots < bp.max_ore + 2 || bp.clay - bp.clay_robots < bp.obsidian_robot_clay || bp.obsidian - bp.obsidian_robots < bp.geode_robot_obsidian) {// || bp.ore <= bp.max_ore || bp.ore <= bp.ore_robot_ore) {
		// 	bp.order += '- ';
		// 	stack.push(bp);
		// }
		// console.log(bp);
		// return;
		// stack.push(bp); // this is as if we just waited.
		// return;
	}

	const endTime = performance.now();
	// console.log(blueprint, maxBp);
	console.log('id', maxBp.id, 'geodes', maxBp.geode, 'time', Math.trunc(endTime - startTime));

	return maxBp;
};

var getMaxGeodeCount = function (blueprint) {
	let stack = [blueprint];
	let tmp = { ...blueprint };
	tmp.waiting = 1;
	stack.push(tmp);
	for (let minute = 0; minute < 15; minute++) {
		let stackCount = stack.length;
		// for (const option of stack) {
		for (let index = 0; index < stackCount; index++) {
			let option = stack[index];

			// let building // what happens if waiting for somoething but then can afford something else after building it? is this covered by the other option? what if can just afford both on this minute?
			// TODO: log if this is the case rather than coding it initially, in case it isn't needed
			let builtRobot = false;
			if (option.waiting === WAITING.ORE) {
				if (option.ore >= option.ore_robot_ore) {
					option.ore -= option.ore_robot_ore;
					option.ore_robots++;
					builtRobot = true;
				}
			} else if (option.waiting === WAITING.CLAY) {
				if (option.ore >= option.clay_robot_ore) {
					option.ore -= option.clay_robot_ore;
					option.clay_robots++;
					builtRobot = true;
				}
			} else if (option.waiting === WAITING.OBSIDIAN) {
				if (option.ore >= option.obsidian_robot_ore || option.clay < option.obsidian_robot_clay) {
					option.ore -= option.obsidian_robot_ore;
					option.clay -= option.obsidian_robot_clay;
					option.obsidian_robots++;
					builtRobot = true;
				}
			} else if (option.waiting === WAITING.GEODE) {
				if (option.ore >= option.geode_robot_ore || option.obsidian < option.geode_robot_obsidian) {
					option.ore -= option.geode_robot_ore;
					option.obsidian -= option.geode_robot_obsidian;
					option.geode_robots++;
					builtRobot = true;
				}
			}

			option.ore += option.ore_robots;
			option.clay += option.clay_robots;
			option.obsidian += option.obsidian_robots;
			option.geode += option.geode_robots;

			// create other options if we built what we were waiting for
			if (!builtRobot) continue;
			option.waiting = 0;
			if (option.obsidian_robots > 0) {
				tmp = { ...option };
				tmp.waiting = 3;
				stack.push(tmp);
			}
			if (option.clay_robots > 0) {
				tmp = { ...option };
				tmp.waiting = 2;
				stack.push(tmp);
			}
			tmp = { ...option };
			tmp.waiting = 1;
			stack.push(tmp);
		}
		// stack.push(...extraOptions);
	}
	let max = stack[0];
	for (const option of stack) {
		if (option.geode > max.geode) max = option;
	}
	return max;
};

var getAnswer2 = function (filename) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let blueprints = data
		.trimEnd()
		.split('\n')
		.map((line) => {
			let res = line.replace('Blueprint ', '');
			res = res.replace(': Each ore robot costs ', ',');
			res = res.replace(' ore. Each clay robot costs ', ',');
			res = res.replace(' ore. Each obsidian robot costs ', ',');
			res = res.replace(' ore and ', ',');
			res = res.replace(' clay. Each geode robot costs ', ',');
			res = res.replace(' ore and ', ',');
			res = res.replace(' obsidian.', '');
			res = res.split(',').map((val) => parseInt(val));
			let blueprint = {
				id: res[0],
				ore_robot_ore: res[1],
				clay_robot_ore: res[2],
				obsidian_robot_ore: res[3],
				obsidian_robot_clay: res[4],
				geode_robot_ore: res[5],
				geode_robot_obsidian: res[6],

				max_ore: Math.max(res[2], res[3], res[5]), // this is excluding the ore robot cost, because we dont want to have to wait for it if we have everything else
				// double_max_ore: 2 * Math.max(res[1], res[2], res[3], res[5]),
				// max_ore: Math.max(res[1], res[2], res[3], res[5]),
				// sum_ore: res[1] + res[2] + res[3] + res[5],
				sum_ore: res[2] + res[3] + res[5],

				ore_robots: 1,
				clay_robots: 0,
				obsidian_robots: 0,
				geode_robots: 0,

				ore: 0,
				clay: 0,
				obsidian: 0,
				geode: 0,

				minute: 0,
				order: '',
				waiting: WAITING.NONE
			};
			return blueprint;
		});
	// return blueprints;

	// return getMaxGeodeCountGreedy(blueprints[1]);
	// return getMaxGeodeCountDFS(blueprints[0]);

	let result = 1;

	console.log(getMaxGeodeCountDFS(blueprints[2], 32));
	for (let index = 0; index < 3 && index < blueprints.length; index++) {
		let max = getMaxGeodeCountDFS(blueprints[index], 32);
		result *= max.geode;
	}

	return result;
};

// console.log('part 1:', getAnswer('./2022-19.sample.txt'), '(sample)', '(expected: 33)');
// console.log('part 1:', getAnswer('./2022-19.txt')); // > 956 > 1305 = 1365

// console.log('part 2:', getAnswer2('./2022-19.sample.txt'), '(sample)'); // 62
console.log('part 2:', getAnswer2('./2022-19.txt')); //

// let maxGeodes = [];
// let element = 0;
// for (let minute = 0; minute < 32; minute ++) {
// 	element += minute;
// 	maxGeodes.push(element);
// }
// console.log(maxGeodes);

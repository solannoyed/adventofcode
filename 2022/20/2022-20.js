import { readFileSync } from "fs";

var getAnswer = function(filename, decryptionKey = 1, mixCount = 1) {
	let data;
	try {
		data = readFileSync(filename, 'utf-8');
	} catch (error) {
		console.error(error);
		return;
	}
	let nums = data.trimEnd().split('\n').map((line, index) => {
		return {
			value: parseInt(line) * decryptionKey,
			index: index
		};
	});
	// console.log(nums.map(num=>num.value).join(', '));
	// console.log(nums);

	for (let mix = 0; mix < mixCount; mix ++) {
		for (let index = 0; index < nums.length; index ++) {
			const location = nums.findIndex(num => num.index === index);
			const [num] = nums.splice(location, 1);
			nums.splice((location + num.value) % nums.length, 0, num);
		}
		// console.log(nums.map(num=>num.value).join(', '));
	}
	// console.log(nums);

	// now search for 0
	const location = nums.findIndex(num => num.value === 0);// console.log(location);
	let result = 0;
	for (let offset = 1000; offset <= 3000; offset += 1000) {
		result += nums[(location + offset) % nums.length].value;
	}
	return result;

	// let set = new Set(nums);
	// return set.size;
	// return nums

	// let indexes = new Array(nums.length);
	// for (let index = 0; index < indexes.length; index ++) indexes[index] = index;

	// for (let index = 0; index < nums.length; index ++) {
	// 	let location = indexes.indexOf(index); // this is where the number is after previous adjustments
	// 	let moveBy = nums[index]; // this is the actual number that we are about to move
	// 	moveBy %= nums.length; // if we move it by the length, and we loop it around, we get to the same place

	// 	if (location + moveBy > nums.length - 1) moveBy -= nums.length - 1; // if we move past the end we want to loop back to the start
	// 	else if (location + moveBy < 0) moveBy += nums.length - 1;
	// 	let destination = location + moveBy;

	// 	// console.log(indexes.map(val=>nums[val]).join(', '));
	// 	indexes.splice(location, 1);
	// 	indexes.splice(destination, 0, index);
	// 	// console.log(indexes.map(val=>nums[val]).join(', '));
	// 	// return;
	// }

	// // return indexes.map(val=>nums[val]);
	// let finalOrder = indexes.map(val=>nums[val]);
	// // console.log(finalOrder);
	// let location = finalOrder.indexOf(0);
	// let result = 0;
	// console.log('location', location);
	// console.log('value', finalOrder[location]);
	// console.log('nums.length', nums.length)
	// for (let offset = 1; offset < 4; offset ++) {
	// 	let coordIndex = location + (offset * 1000);
	// 	coordIndex %= nums.length;
	// 	console.log('next 1000th index', coordIndex, 'and value', finalOrder[coordIndex]);
	// 	result += finalOrder[coordIndex];
	// 	// console.log(finalOrder[coordIndex]);
	// }
	// return result;
}

// console.log('part 1:', getAnswer('./2022-20.sample.txt'), '(sample)'); // 4 + -3 + 2 = 3
// console.log('part 1:', getAnswer('./2022-20.txt')); // != 15317, != -9668

console.log('part 2:', getAnswer('./2022-20.sample.txt', 811589153, 10), '(sample)');
console.log('part 2:', getAnswer('./2022-20.txt', 811589153, 10));

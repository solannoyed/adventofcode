import { describe, expect, test } from 'bun:test';
import process from './part2';

import sample from './sample.txt';
import input from './input.txt';

describe('2023/03 Part 2', () => {
	test('sample', () => {
		expect(process(sample)).toBe(467835);
	});
	test('input', (done) => {
		const result = process(input);
		expect(result).toMatchSnapshot();
		done();
		console.log('Result:', result);
	});
});

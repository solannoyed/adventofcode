import { describe, expect, test } from 'bun:test';
import process from './part2';

import sample from './sample2.txt';
import input from './input.txt';

describe('2023/01 Part 2', () => {
	test('sample2', () => {
		expect(process(sample)).toBe(281);
	});
	test('input', (done) => {
		const result = process(input);
		expect(result).toMatchSnapshot();
		done();
		console.log('Result:', result);
	});
});

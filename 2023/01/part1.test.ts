import { describe, expect, test } from 'bun:test';
import process from './part1';

import sample from './sample.txt';
import input from './input.txt';

describe('2023/01 Part 1', () => {
	test('sample', () => {
		expect(process(sample)).toBe(142);
	});
	test('input', (done) => {
		const result = process(input);
		expect(result).toMatchSnapshot();
		done();
		console.log('Result:', result);
	});
});

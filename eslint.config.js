import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...ts.configs.stylistic,
	prettier,
	{
		rules: {
			// for-of is slower and we (often, for AoC) need to focus on performance
			'@typescript-eslint/prefer-for-of': 'off'
		}
	}
);

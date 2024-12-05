interface Range {
	start: number;
	length: number;
}

interface Mapping {
	destination: number;
	source: number;
	length: number;
}

function mappedRanges(ranges: Range[], mappings: Mapping[]) {
	const destinations: Range[] = [];
	for (const range of ranges) {
		for (const mapping of mappings) {
			if (range.start >= mapping.source && range.start < mapping.source + mapping.length) {
				// if the start is inside the mapping
				const destination: Range = {
					start: mapping.destination + (range.start - mapping.source),
					length: 0
				};
				if (range.start + range.length > mapping.source + mapping.length) {
					// if the end is outside the mapping
					destination.length = mapping.source + mapping.length - range.start;
					destinations.push(destination);

					range.start = mapping.source + mapping.length;
					range.length -= destination.length;
				} else {
					// the end is also inside the mapping (range is completely inside)
					destination.length = range.length;
					destinations.push(destination);

					range.length = 0;
					break;
				}
			} else if (
				range.start + range.length > mapping.source &&
				range.start + range.length <= mapping.source + mapping.length
			) {
				// if the end is inside the mapping [and the start is outside]
				const destination: Range = {
					start: mapping.destination,
					length: range.start + range.length - mapping.source
				};
				destinations.push(destination);

				range.length = mapping.source - range.start;
			} else if (
				range.start < mapping.source &&
				range.start + range.length > mapping.source + mapping.length
			) {
				// range is completely overlapping the mapping
				const destination: Range = {
					start: mapping.destination,
					length: mapping.length
				};
				destinations.push(destination);

				const trailing: Range = {
					start: mapping.source + mapping.length,
					length: range.start + range.length - (mapping.source + mapping.length)
				};
				ranges.push(trailing);

				range.length = mapping.source - range.start;
			}
		}
		if (range.length > 0) {
			destinations.push(range);
		}
	}

	return destinations;
}

export default function (input: string) {
	const [[seeds], ...groups] = input
		.trim()
		.split('\n\n')
		.map((group) => group.split(':')[1].trim())
		.map((lists) => lists.split('\n').map((maps) => maps.split(' ').map((num) => parseInt(num))));

	let ranges: Range[] = [];
	for (let index = 0; index < seeds.length; index += 2) {
		ranges.push({ start: seeds[index], length: seeds[index + 1] });
	}

	groups
		.map((group) =>
			group.map(([destination, source, length]): Mapping => {
				return {
					destination,
					source,
					length
				};
			})
		)
		.forEach((mappings) => {
			ranges = mappedRanges(ranges, mappings);
		});

	return Math.min(...ranges.map((range) => range.start));
}

export default function (input: string) {
	const hands = input
		.trim()
		.split('\n')
		.map((line) => line.trim().split(' '))
		.map(([cards, bid]) => {
			const hand = cards.split('').map((card) => {
				switch (card) {
					case 'A':
						return 14;
					case 'K':
						return 13;
					case 'Q':
						return 12;
					case 'J':
						return 11;
					case 'T':
						return 10;
					default:
						return parseInt(card);
				}
			});
			return {
				hand,
				type: getType(hand),
				bid: parseInt(bid)
			};
		});
	hands.sort((first, second) => {
		if (first.type != second.type) return second.type - first.type;
		for (let index = 0; index < 5; index++) {
			if (first.hand[index] != second.hand[index]) return first.hand[index] - second.hand[index];
		}
		return 0;
	});
	return hands.reduce((accumulator, value, index) => {
		return accumulator + (index + 1) * value.bid;
	}, 0);
}

function getType(hand: number[]) {
	let map = new Map<number, number>();
	for (const card of hand) {
		map.set(card, (map.get(card) ?? 0) + 1);
	}
	const counts = [...map.values()];
	counts.sort((first, second) => second - first);

	if (counts[0] == 5) return 0; // five of a kind
	if (counts[0] == 4) return 1; // four of a kind
	if (counts[0] == 3 && counts[1] == 2) return 2; // full house
	if (counts[0] == 3) return 3; // three of a kind
	if (counts[0] == 2 && counts[1] == 2) return 4; // two pair
	if (counts[0] == 2) return 5; // one pair
	if (counts[0] == 1) return 6; // high card
	return -1; // shouldn't happen!
}

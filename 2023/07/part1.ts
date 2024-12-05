export default function (input: string, deck = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'], joker = -1) {
	const hands = input
		.trim()
		.split('\n')
		.map((line) => line.trim().split(' '))
		.map(([cards, bid]) => {
			const hand = cards.split('').map((card) => deck.indexOf(card));
			return {
				hand,
				type: getType(hand, joker),
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

function getType(hand: number[], joker: number) {
	const map = new Map<number, number>();
	for (const card of hand) {
		map.set(card, (map.get(card) ?? 0) + 1);
	}
	const jokers = map.get(joker) ?? 0;
	map.delete(joker);

	const counts = [...map.values()];
	counts.sort((first, second) => second - first);
	counts[0] += jokers;

	if (jokers == 5 || counts[0] == 5) return 0; // five of a kind
	if (counts[0] == 4) return 1; // four of a kind
	if (counts[0] == 3 && counts[1] == 2) return 2; // full house
	if (counts[0] == 3) return 3; // three of a kind
	if (counts[0] == 2 && counts[1] == 2) return 4; // two pair
	if (counts[0] == 2) return 5; // one pair
	if (counts[0] == 1) return 6; // high card
	return -1; // shouldn't happen!
}

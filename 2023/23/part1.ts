import { CARDINALS } from 'lib/directions';

export default function (input: string) {
	// process the input into `Tile`s for a "map" that we can use
	const map = input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((tile) => tile as Tile));
	const graph = getGraph(map);
	const start = graph.get('1,0')!;
	const end = graph.get(`${map[0].length - 2},${map.length - 1}`)!;

	let max = 0;
	const queue = [{ length: 0, path: [start] }];
	while (queue.length > 0) {
		const { length, path } = queue.pop()!;
		const prev = path.at(-1)!;
		for (const edge of prev.edges) {
			// don't loop
			if (path.includes(edge.destination!)) continue;
			if (edge.destination == end) {
				max = Math.max(max, length + edge.weight);
				continue;
			}
			queue.push({
				length: length + edge.weight,
				path: [...path, edge.destination!]
			});
		}
	}
	return max;
}

function getGraph(map: Tile[][]) {
	// convert this into a directed and weighted graph
	const nodes = new Map<string, Node>();
	const position: Position = {
		x: 1,
		y: 0,
		direction: 2
	};
	const edge: Edge = {
		weight: 0,
		direction: 0
	};
	const node: Node = {
		x: 1,
		y: 0,
		edges: []
	};
	nodes.set(`${position.x},${position.y}`, node);

	const queue = [{ node, edge, position }];
	while (queue.length > 0) {
		const { node, edge, position } = queue.pop()!; // have to do DFS (pop) otherwise we will run into another edge mid-path --> <--
		if (map[position.y][position.x] == 'O') {
			const current = nodes.get(`${position.x},${position.y}`);
			if (current == undefined) continue;

			// we have arrived at an explored node, we need to attach the edge
			if (edge.direction >= 0) {
				edge.destination = current;
				node.edges.push(edge);
			}
			if (edge.direction <= 0) {
				const mirror = { ...edge };
				mirror.destination = node;
				current.edges.push(mirror);
			}
			continue;
		}
		map[position.y][position.x] = 'O';

		const destinations: Position[] = [];
		// could potentially speed this up if necessary by looping while `destinations.length == 1`
		for (let direction = 0; direction < CARDINALS.length; direction++) {
			if ((position.direction + 2) % 4 == direction) continue; // don't go back the opposite way
			const next: Position = {
				x: position.x + CARDINALS[direction].x,
				y: position.y + CARDINALS[direction].y,
				direction
			};
			if (!map[next.y] || !map[next.y][next.x]) continue; // outside of map
			if (map[next.y][next.x] == '#') continue; // wall
			destinations.push(next);
		}

		if (destinations.length != 1) {
			// make or get the node at this position
			const hash = `${position.x},${position.y}`;
			const current: Node = nodes.get(hash) ?? { x: position.x, y: position.y, edges: [] };
			nodes.set(hash, current);
			// attach the edge to the node/s
			if (edge.direction >= 0) {
				edge.destination = current;
				node.edges.push(edge);
			}
			if (edge.direction <= 0) {
				const mirror = { ...edge };
				mirror.destination = node;
				current.edges.push(mirror);
			}
			// queue the new edges
			for (const position of destinations) {
				const edge: Edge = {
					weight: 1,
					direction: 0
				};
				queue.push({ node: current, edge, position });
			}
		} else {
			edge.weight++;
			const position = destinations[0];
			switch (map[position.y][position.x]) {
				case '^':
					if (position.direction == 0) edge.direction = 1;
					else edge.direction = -1;
					break;
				case '>':
					if (position.direction == 1) edge.direction = 1;
					else edge.direction = -1;
					break;
				case 'v':
					if (position.direction == 2) edge.direction = 1;
					else edge.direction = -1;
					break;
				case '<':
					if (position.direction == 3) edge.direction = 1;
					else edge.direction = -1;
					break;
				default:
					break;
			}
			queue.push({ node, edge, position });
		}
	}
	return nodes;
}

type Tile = '#' | '.' | 'O' | Slope;
type Slope = '^' | '>' | 'v' | '<';

interface Position {
	x: number;
	y: number;
	direction: number;
}
interface Node {
	x: number;
	y: number;
	edges: Edge[];
}
interface Edge {
	weight: number;
	direction: -1 | 0 | 1;
	destination?: Node;
}

export default function (input: string) {
	const labels: string[] = [];
	const graph: number[][] = [];
	const edges: Edge[] = [];
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [first, second] = line.split(': ');
			return [first, ...second.split(' ')];
		})
		.forEach(([component, ...connections]) => {
			const first = indexOf(component, labels);
			while (first >= graph.length) graph.push([]);
			for (const connection of connections) {
				const second = indexOf(connection, labels);
				while (second >= graph.length) graph.push([]);
				graph[first].push(second);
				graph[second].push(first);

				if (first < second) edges.push({ first, second });
				else edges.push({ first: second, second: first });
			}
		});

	const weights: number[][] = [];
	for (let index = 0; index < graph.length; index++) {
		weights.push(new Array(graph[index].length).fill(0));
	}
	let size = labels.length;
	while (size == labels.length) {
		for (let iterations = 0; iterations < 50; iterations++) {
			const [from, to] = randomPair(labels.length);
			const path = getPath(from, to, graph);
			for (let first = 0; first < path.length; first++) {
				for (let second = first + 1; second < path.length; second++) {
					weights[path[first]][graph[path[first]].indexOf(path[second])]++;
					weights[path[second]][graph[path[first]].indexOf(path[first])]++;
				}
			}
		}
		edges.sort(
			(first, second) =>
				weights[second.first][graph[second.first].indexOf(second.second)] -
				weights[first.first][graph[first.first].indexOf(first.second)]
		);
		size = reachable(0, graph, edges);
	}
	return (labels.length - size) * size;
}

interface Edge {
	first: number;
	second: number;
}

function indexOf(label: string, labels: string[]) {
	let index = labels.indexOf(label);
	if (index < 0) {
		index = labels.length;
		labels.push(label);
	}
	return index;
}

function getPath(from: number, to: number, graph: number[][]) {
	const visited: boolean[] = new Array(graph.length).fill(false);
	visited[from] = true;
	const queue = [[from]];
	while (queue.length > 0) {
		const path = queue.shift()!;
		for (const next of graph[path.at(-1)!]) {
			// found it, early exit
			if (next == to) {
				path.push(next);
				return path;
			}
			// dont revisit nodes
			if (visited[next]) continue;
			visited[next] = true;
			// add to the queue
			queue.push([...path, next]);
		}
	}
	// no path was found (this should only happen after disconnecting the graph, not with initial input)
	return [];
}

function reachable(from: number, graph: number[][], edges: Edge[]) {
	const visited: boolean[] = new Array(graph.length).fill(false);
	visited[from] = true;
	const queue = [from];
	while (queue.length > 0) {
		const current = queue.pop()!;
		edge: for (const next of graph[current]) {
			const min = Math.min(current, next);
			const max = Math.max(current, next);
			// ignore the first 3 edges
			for (let edge = 0; edge < 3; edge++) {
				if (edges[edge].first == min && edges[edge].second == max) continue edge;
			}
			if (visited[next]) continue;
			visited[next] = true;
			queue.push(next);
		}
	}
	return visited.filter((item) => item).length;
}

function randomPair(length: number) {
	const first = Math.floor(Math.random() * length);
	let second = first;
	while (second == first) second = Math.floor(Math.random() * length);
	return [first, second];
}

export default function (input: string) {
	const s: Hailstone[] = input
		.trim()
		.split('\n')
		.map((line) =>
			line
				.split(' @ ')
				.map((side) => side.split(', ').map((num) => parseInt(num)))
				.map(([x, y, z]) => {
					return {
						x,
						y,
						z
					};
				})
		)
		.map(([position, velocity]) => {
			return {
				x: position.x,
				y: position.y,
				z: position.z,
				dx: velocity.x,
				dy: velocity.y,
				dz: velocity.z
			};
		});

	const xy: Coefficients[] = [];
	const xz: Coefficients[] = [];

	const equations = 4; // we need 4 of each because we have 4 variables
	equations: for (let first = 0; first < s.length; first++) {
		// we are jumping around a bit because my input had issues with precision and certain combinations
		for (let second = first + 1; second < s.length; second += 2) {
			if (xy.length >= equations && xz.length >= equations) break equations;

			// I've skipped ones that are parallel in some way
			let coeff = getCoefficientsXY(s, first, second);
			if (coeff.a != 0 && coeff.b != 0 && coeff.c != 0 && coeff.d != 0 && coeff.e != 0)
				xy.push(coeff);
			coeff = getCoefficientsXZ(s, first, second);
			if (coeff.a != 0 && coeff.b != 0 && coeff.c != 0 && coeff.d != 0 && coeff.e != 0)
				xz.push(coeff);
		}
	}

	// Gaussian Elimination
	// -----   X-Y axis

	subtractCoefficients(xy[1], xy[0], xy[1].a / xy[0].a);
	subtractCoefficients(xy[2], xy[0], xy[2].a / xy[0].a);
	subtractCoefficients(xy[3], xy[0], xy[3].a / xy[0].a);
	xy[1].a = xy[2].a = xy[3].a = 0;

	subtractCoefficients(xy[2], xy[1], xy[2].b / xy[1].b);
	subtractCoefficients(xy[3], xy[1], xy[3].b / xy[1].b);
	xy[2].b = xy[3].b = 0;

	subtractCoefficients(xy[3], xy[2], xy[3].c / xy[2].c);
	xy[3].c = 0;

	subtractCoefficients(xy[0], xy[3], xy[0].d / xy[3].d);
	subtractCoefficients(xy[1], xy[3], xy[1].d / xy[3].d);
	subtractCoefficients(xy[2], xy[3], xy[2].d / xy[3].d);
	xy[2].d = 0;

	subtractCoefficients(xy[0], xy[2], xy[0].c / xy[2].c);
	subtractCoefficients(xy[1], xy[2], xy[1].c / xy[2].c);

	subtractCoefficients(xy[0], xy[1], xy[0].b / xy[1].b);
	xy[0].b = 0;

	// Gaussian Elimination
	// -----   X-Z axis

	subtractCoefficients(xz[1], xz[0], xz[1].a / xz[0].a);
	subtractCoefficients(xz[2], xz[0], xz[2].a / xz[0].a);
	subtractCoefficients(xz[3], xz[0], xz[3].a / xz[0].a);
	xz[1].a = xz[2].a = xz[3].a = 0;

	subtractCoefficients(xz[2], xz[1], xz[2].b / xz[1].b);
	subtractCoefficients(xz[3], xz[1], xz[3].b / xz[1].b);
	xz[2].b = xz[3].b = 0;

	subtractCoefficients(xz[3], xz[2], xz[3].c / xz[2].c);
	xz[3].c = 0;

	subtractCoefficients(xz[0], xz[3], xz[0].d / xz[3].d);
	subtractCoefficients(xz[1], xz[3], xz[1].d / xz[3].d);
	subtractCoefficients(xz[2], xz[3], xz[2].d / xz[3].d);
	xz[2].d = 0;

	subtractCoefficients(xz[0], xz[2], xz[0].c / xz[2].c);
	subtractCoefficients(xz[1], xz[2], xz[1].c / xz[2].c);

	subtractCoefficients(xz[0], xz[1], xz[0].b / xz[1].b);
	xz[0].b = 0;

	// take the average because of precision issues.
	const result: Hailstone = {
		x: (xy[0].e / xy[0].a + xz[0].e / xz[0].a) / 2,
		y: xy[1].e / xy[1].b,
		z: xz[1].e / xz[1].b,
		dx: xy[2].e / xy[2].c,
		dy: xy[3].e / xy[3].d,
		dz: xz[3].e / xz[3].d
	};
	return Math.round(result.x + result.y + result.z);
}

function subtractCoefficients(c: Coefficients, s: Coefficients, multiple: number) {
	c.a -= multiple * s.a;
	c.b -= multiple * s.b;
	c.c -= multiple * s.c;
	c.d -= multiple * s.d;
	c.e -= multiple * s.e;
}

/**
 * x + t * dx = x0 + t * dx0
 * t = (x - x0) / (dx0 - dx) = (y - y0) / (dy0 - dy)
 *     (x - x0) * (dy0 - dy) = (y - y0) * (dx0 - dx)
 * x*dy0 - x*dy - x0*dy0 + x0*dy = y*dx0 - y*dx - y0*dx0 + y0*dx
 * dy0*x - dx0*y - y0*dx - x0*dy = x0*dy0 - y0*dx0 + x*dy - y*dx (first)
 * dy1*x - dx1*y - y1*dx - x1*dy = x1*dy1 - y1*dx1 + x*dy - y*dx (second)
 * (first) - (second): a*x + b*y + c*dx + d*dy = e
 * (dy0 - dy1)*x + (dx1 - dx0)*y + (y1 - y0)*dx + (x1 - x0)*dy = (x0*dx0 - x1*dy1 - y0*dx0 + y1*dx1)
 *
 * @param s
 * @param first
 * @param second
 * @returns
 */
function getCoefficientsXY(s: Hailstone[], first: number, second: number): Coefficients {
	return {
		a: s[first].dy - s[second].dy,
		b: s[second].dx - s[first].dx,
		c: s[second].y - s[first].y,
		d: s[first].x - s[second].x,
		e:
			s[first].x * s[first].dy -
			s[second].x * s[second].dy -
			s[first].y * s[first].dx +
			s[second].y * s[second].dx
	};
}

function getCoefficientsXZ(s: Hailstone[], first: number, second: number): Coefficients {
	return {
		a: s[first].dz - s[second].dz,
		b: s[second].dx - s[first].dx,
		c: s[second].z - s[first].z,
		d: s[first].x - s[second].x,
		e:
			s[first].x * s[first].dz -
			s[second].x * s[second].dz -
			s[first].z * s[first].dx +
			s[second].z * s[second].dx
	};
}

interface Hailstone {
	x: number;
	y: number;
	z: number;
	dx: number;
	dy: number;
	dz: number;
}

interface Coefficients {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
}

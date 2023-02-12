import p5Types from 'p5';
import type Attractor from './Attractor';

// eslint-disable-next-line @typescript-eslint/naming-convention
const G = 1;

class Particle {
	position: p5Types.Vector;
	velocity: p5Types.Vector;
	mass = 1;
	color: p5Types.Color;
	forceInversion = 1;

	constructor(p5: p5Types, target: Attractor, x: number, y: number) {
		this.position = p5.createVector(x, y);
		this.velocity = p5.createVector(0, 0);
		// this.velocity = p5.constrain(p5Types.Vector.random2D(), 0.1, 1);
		this.color = p5.color(0, 0, 255, 255);
	}

	update(p5: p5Types, target: Attractor, deltaTime: number) {
		/* Calculate new position */
		const toTarget = p5Types.Vector.sub(target.position, this.position);
		const m1m2 = target.mass * this.mass;
		const distanceSquared = Math.max(toTarget.dot(toTarget), 0.001 * 0.001); // Define a minimum distance to avoid division by zero
		// const distanceSquared = p5.constrain(toTarget.magSq(), 100, 10000); // Define a minimum distance to avoid division by zero
		// const distanceSquared = toTarget.magSq();

		// Sum of forces = (G * m1 * m2 / r^2 )
		const force = toTarget.normalize().mult(G * m1m2 / distanceSquared); // multiplied by the normalized vector toTarget to get the direction of the force
		// Acceleration = Force / mass
		const acceleration = force.div(this.mass).mult(this.forceInversion);

		// p = p0 + v0 * t + a * t^2 / 2
		this.position.add(this.velocity.mult(deltaTime)).add(acceleration.mult(deltaTime * deltaTime).div(2));
		// v = v0 + a * t
		this.velocity.add(acceleration.mult(deltaTime));

		/* Calculate new color according to distance */
		// this.color = p5.lerpColor(p5.color(0, 255, 255, 255),
		// 	p5.color(0, 255, 0, 255),
		// 	// on a scale from 0 to 1 based on the speed of the particle
		// 	Math.min(this.velocity.mag() / 10, 1));
	}

	show(p5: p5Types) {
		p5.stroke(this.color);
		p5.strokeWeight(4);
		p5.point(this.position.x, this.position.y);
	}

	toggleAttractedRepulsed = () => {
		this.forceInversion = -this.forceInversion;
	};
}

export default Particle;

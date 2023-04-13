/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020, February 2021
 *
 */

/**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://cs559.github.io/559Tutorials/javascript/oop-in-js-1/
 */
class Boid {
    /**
     * 
     * @param {number} x    - initial X position
     * @param {number} y    - initial Y position
     * @param {number} vx   - initial X velocity
     * @param {number} vy   - initial Y velocity
     */
    constructor(x, y, vx = 1, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = defaultColor;
        this.collisionCooldown = collisionFrames;
    }
    
    /**
     * Draw the Boid
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        const theta = (this.vx < 0) ? Math.atan(this.vy / this.vx) + Math.PI : Math.atan(this.vy / this.vx);
        context.rotate(theta);

        context.fillStyle = "orange";
        context.beginPath();
        context.moveTo(0, -5);
        context.lineTo(-15, 0);
        context.lineTo(0, 5);
        context.fill();

        context.fillStyle = this.color;
        context.beginPath();
        context.arc(0, 0, boidRadius, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
    /**
     * Perform the "steering" behavior -
     * This function should update the velocity based on the other
     * members of the flock.
     * It is passed the entire flock (an array of Boids) - that includes
     * "this"!
     * Note: dealing with the boundaries does not need to be handled here
     * (in fact it can't be, since there is no awareness of the canvas)
     * *
     * And remember, (vx,vy) should always be a unit vector!
     * @param {Array<Boid>} flock 
     */
    steer(flock) {
        
        const boidIndex = boids.indexOf(this);
        
        // const speed = Math.sqrt(Math.pow(boid.vx, 2) + Math.pow(boid.vy, 2));
        
        //boid collisions
        for (let i = 0; i < boids.length; ++i) {
            const d = distance(this.x, this.y, boids[i].x, boids[i].y);
            if (i != boidIndex && d <= boidRadius * 2) {
                
                const mx = (this.x + boids[i].x) / 2;
                const my = (this.y + boids[i].y) / 2;
                this.x = mx + boidRadius * (this.x - boids[i].x) / d;
                this.y = my + boidRadius * (this.y - boids[i].y) / d;
                boids[i].x = mx + boidRadius * (boids[i].x - this.x) / d;
                boids[i].y = my + boidRadius * (boids[i].y - this.y) / d;
                
                const newD = distance(this.x, this.y, boids[i].x, boids[i].y);

                const ux = (boids[i].x - this.x) / newD;
                const uy = Math.sqrt(1 - Math.pow(ux, 2));

                if (this.x > boids[i].x) {
                    this.vx = ux;
                    boids[i].vx = -ux;
                }
                else {
                    this.vx = -ux;
                    boids[i].vx = ux;
                }

                if (this.y > boids[i].y) {
                    this.vy = uy;
                    boids[i].vy = -uy;
                }
                else {
                    this.vy = -uy;
                    boids[i].vy = uy;
                }

                this.color = boidCollisionColor;
                this.collisionCooldown = collisionFrames;
                boids[i].color = boidCollisionColor;
                boids[i].collisionCooldown = collisionFrames;
            }
        }
        
        //flocking behavior - grouping
        const groupRadius = 100;
        let avgx = 0;
        let avgy = 0;
        let count = 0;
        flock.forEach( boid => {
            if (distance(this.x, this.y, boid.x, boid.y) <= groupRadius) {
                avgx += boid.x;
                avgy += boid.y;
                ++count;
            }
        });
        avgx = avgx / count;
        avgy = avgy / count;

        this.vx += (avgx - this.x) * .0025;
        this.vy += (avgy - this.y) * .0025;

        const m = Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));

        this.vx = this.vx / m;
        this.vy = this.vy / m;


    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 -x1, 2) + Math.pow(y2 - y1, 2));
}

const collisionFrames = 8;
const defaultColor = "red";
const wallCollisionColor = "blue";
const boidCollisionColor = "green";
const boidRadius = 5;
/** the actual main program
 * this used to be inside of a function definition that window.onload
 * was set to - however, now we use defer for loading
 */

 /** @type Array<Boid> */
let boids = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
let context = canvas.getContext("2d");

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    boids.forEach(boid => boid.draw(context));
}

/**
 * Handle the buttons
 */
document.getElementById("add").onclick = function () {
    for (let i = 0; i < 10; ++i) {
        const vx = Math.random() * 2 - 1;
        const vy = Math.random() < 0.5 ? Math.sqrt(1 - Math.pow(vx, 2)) : -Math.sqrt(1 - Math.pow(vx, 2));
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        boids.push(new Boid(x, y, vx, vy));
    }
};
document.getElementById("clear").onclick = function () {
    boids = [];
};

let lastTime; // will be undefined by default
/**
 * The Actual Execution
 */
function loop(timestamp) {
    // time step - convert to 1/60th of a second frames
    // 1000ms / 60fps
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;

    // change directions
    let avgvx = 0;
    let avgvy = 0;
    boids.forEach(boid => {
        avgvx += boid.vx;
        avgvy += boid.vy;
        boid.steer(boids)
    });
    
    //console.log(`${Math.sqrt(Math.pow(avgvx / boids.length, 2) + Math.pow(avgvy / boids.length, 2))}`);
    // move forward
    let speed = Number(speedSlider.value);
    boids.forEach(function (boid) {
        boid.x += boid.vx * speed;
        boid.y += boid.vy * speed;
    });
    // make sure that we stay on the screen
    boids.forEach(function (boid) {

        if (boid.color !== defaultColor) {
            if (--boid.collisionCooldown <= 0) {
                boid.color = defaultColor;
                boid.collisionCooldown = collisionFrames;
            }
        }

        //wall collisions
        if (boid.x >= canvas.width) {
            boid.x = canvas.width;
            boid.vx = -boid.vx;
            boid.color = wallCollisionColor;
            boid.collisionCooldown = collisionFrames;
        }
        else if (boid.x <= 0) {
            boid.x = 0;
            boid.vx = -boid.vx;
            boid.color = wallCollisionColor;
            boid.collisionCooldown = collisionFrames;
        }
        if (boid.y >= canvas.height) {
            boid.y = canvas.height;
            boid.vy = -boid.vy;
            boid.color = wallCollisionColor;
            boid.collisionCooldown = collisionFrames;
        }
        else if (boid.y <= 0) {
            boid.y = 0;
            boid.vy = -boid.vy;
            boid.color = wallCollisionColor;
            boid.collisionCooldown = collisionFrames;
        }
    });
    // now we can draw
    draw();
    // and loop
    window.requestAnimationFrame(loop);

}
// start the loop with the first iteration
window.requestAnimationFrame(loop);



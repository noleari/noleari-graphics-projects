/**
 * Starter file for 02-08-01.js - the only exercise of page 8 of Workbook 2
 */

// @ts-check

const canvas1 = /** @type {HTMLCanvasElement} */ (document.getElementById('box2canvas'));
canvas1.setAttribute('style', 'background-color:#000000');
const context = canvas1.getContext('2d');

let mouseX = canvas1.width / 2;
let mouseY = canvas1.height / 2;

const GRAVITY =  -.000065; //found this gravity by trial and error once physics was in place

let fireworks = [];
const fireworkColors = ['#FF5F1F', '#FF4433', '#FF7518', '#EC5800', '#FF5F1F', '#F28C28'];
const FIREWORK_RADIUS = 3;

let trailParticles = [];
const trailColors = ['#FF0000', '#FF5F1F', '#FFC000', '#FFA500'];
const TRAIL_RADIUS = 1;


let explosions = [];
const explosionColors = [
    ['#1B1BE0', '#1BCDE0'], //dark blue + light blue
    ['#7D1BE0', '#CA1BE0'], //dark purple + pinkish purple
    ['#E01B1B', '#FFA600'], //red + orange
    ['#00FFD6', '#3000FF'], //turqoise + blue
    ['#007EFF', '#9000FF'], //baby blue + purple
    ['#FF003A', '#FF00E4'], //red + pink
    ['#00A225', '#25F700'], //dark green + light green
];//some vibrant colors
const EXPLOSION_RADIUS = 2;

function numberToHex(num) {
    return ("0"+(Number(num).toString(16))).slice(-2);
}

let mOnCanvas = false;

canvas1.onmousemove = event => {
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    mouseX = event.clientX - box.left;
    mouseY = event.clientY - box.top;
    mOnCanvas = true;
};

canvas1.onmouseleave = event => {
    mOnCanvas = false;
}

canvas1.onclick = createFirework;

function createFirework(event) {
    //create random starting x and y = height
    const xi = Math.random() * canvas1.width;
    //target coordinates
    const xf = mouseX;
    const yf = canvas1.height - mouseY;
    //generate how long firework takes to get to target in ms
    const t = Math.random() * 1000 + 2000;
    //calculate starting velocities - used (yf - yi) = vyi*t - 1/2gt^2 to solve for initial vy
    const vxi = (xf - xi) / t;
    const vyi = (yf - 1 / 2 * GRAVITY * Math.pow(t, 2)) / t;


    fireworks.push({x:xi, y:canvas1.height, targetX:xf, targetY:yf, velX:vxi, velY:vyi, time:t, color:0});
};


function drawFireworks(fireworks) {
    if (!context) throw new Error();
    fireworks.forEach(firework => {
        if (frameCounter % 10 == 0) firework.color++;
        context.strokeStyle = '#000000';
        context.lineWidth = .1;
        context.fillStyle = fireworkColors[firework.color % 6];
        context.beginPath();
        context.arc(firework.x, firework.y, FIREWORK_RADIUS, 0, Math.PI * 2);
        context.fill();
        //context.stroke();
    });
    
}

function updateFireworks(fireworks, timeChange) {
    if (!context) throw new Error();

    fireworks.forEach(firework => {
        //console.log(`${firework.x}, ${firework.y}\n${firework.velX} ${firework.velY}\n${firework.targetX} ${firework.targetY}\n ${firework.time}`);

        firework.x = firework.x + firework.velX * timeChange;
        firework.y = firework.y - firework.velY * timeChange;
        firework.velY = firework.velY + GRAVITY * timeChange;
        firework.time = firework.time - timeChange;
        if (frameCounter % 2 == 0) {
            createTrailParticle(firework);
        }

        if (firework.time <= 0) {
            createExplosion(firework);
            firework.x = -10;
            firework.y = -10;
        }
    });
    
    removeFireworks();
}

function removeFireworks() {
    for (let i = 0; i < fireworks.length; ++i) {
        if (fireworks[i].y < 0 || fireworks[i].y > canvas1.height) {
            fireworks[i--] = fireworks[fireworks.length - 1];
            fireworks.pop();
        }
    }
}

function createTrailParticle(firework) {
    trailParticles.push({x: firework.x, y:firework.y, velX: Math.random() * .1 - 0.05 - firework.velX, velY: -firework.velY * .8 + Math.random() * .1 - .05, opacity: 255, color: Math.floor(Math.random() * trailColors.length - .1)})
}

function drawTrails(trailParticles) {
    if (!context) throw new Error();
    trailParticles.forEach(particle => {
        context.fillStyle = trailColors[particle.color] + numberToHex(particle.opacity);
        context.beginPath();
        context.arc(particle.x, particle.y, TRAIL_RADIUS, 0, Math.PI * 2);
        context.fill();
    });
}

function updateTrails(trailParticles, timeChange) {
    trailParticles.forEach(particle => {
        particle.x = particle.x + particle.velX * timeChange;
        particle.y = particle.y - particle.velY * timeChange;
        particle.velY = particle.velY + GRAVITY * timeChange;
        particle.opacity = particle.opacity - 8;

        if (particle.opacity <= 0) {
            particle.x = -10;
            particle.y = -10;
        }
    });
}

function removeTrails() {
    for (let i = 0; i < trailParticles.length; ++i) {
        if (trailParticles[i].y < 0 || trailParticles[i].y > canvas1.height) {
            trailParticles[i--] = trailParticles[trailParticles.length - 1];
            trailParticles.pop();
        }
    }
}

function createExplosion(firework) {
    const c = Math.floor(Math.random() * (explosionColors.length));
    for (let i = 0; i < 40; ++i) {
        explosions.push({
            x:firework.x, 
            y:firework.y, 
            velX:(Math.random() * .2 - .1) + firework.velX * .3,
            velY:(Math.random() * .2 - .1) + firework.velY * .3, 
            color:explosionColors[c][0], 
            opacity:255});
        explosions.push({
            x:firework.x, 
            y:firework.y, 
            velX:(Math.random() * .1 - .05) + firework.velX * .5,
            velY:(Math.random() * .1 - .05) + firework.velY * .5, 
            color:explosionColors[c][1], 
            opacity:255});
    }
}

function drawExplosions(explosions) {
    if (!context) throw new Error();
    explosions.forEach(explosion => {
        context.fillStyle = explosion.color + numberToHex(explosion.opacity);
        context.beginPath();
        context.arc(explosion.x, explosion.y, EXPLOSION_RADIUS, 0, Math.PI * 2);
        context.fill();
    });
}

function updateExplosions(explosions, timeChange) {
    explosions.forEach(explosion => {
        explosion.x = explosion.x + explosion.velX * timeChange;
        explosion.y = explosion.y - explosion.velY * timeChange;
        explosion.velY = explosion.velY + GRAVITY * timeChange;
        explosion.opacity = explosion.opacity - 3;

        if (explosion.opacity <= 0) {
            explosion.x = -10;
            explosion.y = -10;
        }
    });

    removeExplosions();
}

function removeExplosions() {
    for (let i = 0; i < explosions.length; ++i) {
        if (explosions[i].y < 0) {
            explosions[i--] = explosions[explosions.length - 1];
            explosions.pop();
        }
    }
}

let frameCounter = 0;
let prevtime;
function animate(time) {
    if (!context) throw new Error();
    
    frameCounter++;
    
    const timeChange = prevtime ? time - prevtime : 0;
    prevtime = time;

    if (frameCounter % 90 == 0) {
        if (!mOnCanvas) {
            mouseX = Math.random() * canvas1.width;
            mouseY = Math.random() * canvas1.height * 3 / 4;
        }
        createFirework();
        createFirework();
    }

    updateFireworks(fireworks, timeChange);
    updateTrails(trailParticles, timeChange);
    updateExplosions(explosions, timeChange);
    
    context.clearRect(0, 0, canvas1.width, canvas1.height);

    drawFireworks(fireworks);
    drawTrails(trailParticles);
    drawExplosions(explosions);



    requestAnimationFrame(animate);
}
animate();
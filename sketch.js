// n is a counter for the seeds
let n = 0;
// c is a constant that affects the spacing of the seeds
let c = 2;
// scale is a scaling factor for the positions of the seeds
let scale = 10;
// seeds is an array to store the seed objects
let seeds = [];


// setup() is called once when the program starts
function setup() {
  createCanvas(800, 800);
  background(0);
  angleMode(DEGREES)
  // The golden angle in degrees
  goldenAngle = 137.5;

  // Create the seeds
  createSeeds(21 * 15);
}

// draw() is called repeatedly
function draw() {
  // Move the origin to the center of the canvas
  translate(width / 2, height / 2);

  // Draw the seeds
  drawSeeds();

  // Stop draw() from looping
  noLoop();
}

// Creates the seed objects and stores them in the seeds array
function createSeeds(nSeeds) {
  for (let n = 0; n < nSeeds; n++) {
    // Calculate the angle and radius for the current seed
    var a = n * goldenAngle;
    var r = c * sqrt(n);
    // Calculate the x/y positions and size of the seed
    var x = r * cos(a) * scale;
    var y = r * sin(a) * scale;
    var size = map(n, 0, nSeeds, 4 * c, 8 * c);
    // Add the seed object to the seeds array
    seeds.push({ x: x, y: y, size: size });
  }
}

// Draws the seeds on the canvas
function drawSeeds() {
  for (let i = 0; i < seeds.length; i++) {
    let seed = seeds[i];
    // Set the fill color to white
    fill(255);
    // Disable drawing the stroke
    noStroke();
    // Draw the seed as an ellipse
    ellipse(seed.x, seed.y, seed.size, seed.size);
  }
}
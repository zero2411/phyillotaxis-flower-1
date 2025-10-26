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

  // Initialize Voronoi
  voronoi = new Voronoi();

  // Create the seeds
  createSeeds(21 * 15);

  // Define the bounding box for the Voronoi diagram
  let bbox = {
    xl: 0,
    xr: width,
    yt: 0,
    yb: height
  };

  // Convert seeds to the format expected by the Voronoi library
  let sites = seeds.map(seed => ({ x: seed.x, y: seed.y }));

  // Compute Voronoi diagram with proper boundaries
  voronoi = voronoi.compute(sites, bbox);
}

// draw() is called repeatedly
function draw() {
  background(0);

  drawSeeds();

  //drawVonoroi();

  //saveAsSvg();
  
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
    var x = width / 2 + r * cos(a) * scale;
    var y = height / 2 + r * sin(a) * scale;
    var size = map(n, 0, nSeeds, 4 * c, 8 * c);
    // Add the seed object to the seeds array
    seeds.push({ x: x, y: y, size: size });
  }
}

// Draws the seeds and Voronoi cells on the canvas
function drawVonoroi() {
  // Draw Voronoi cells
  stroke(255, 100); // White with some transparency
  strokeWeight(1);
  noFill();

  // Calculate circle properties
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = min(width, height) / 2 - 30; // Slightly smaller than canvas

  ellipse(centerX, centerY, radius * 2, radius * 2);

  // Draw all Voronoi edges, clipping them to the circle
  for (let edge of voronoi.edges) {
    let x1 = edge.va.x;
    let y1 = edge.va.y;
    let x2 = edge.vb.x;
    let y2 = edge.vb.y;

    // Get distances from circle center
    let d1 = dist(x1, y1, centerX, centerY);
    let d2 = dist(x2, y2, centerX, centerY);

    // If both points are outside the circle and on opposite sides, skip this edge
    if (d1 > radius && d2 > radius) {
      continue;
    }

    // If one point is outside, find intersection with circle
    if (d1 > radius || d2 > radius) {
      // Vector from point 1 to point 2
      let dx = x2 - x1;
      let dy = y2 - y1;

      // Quadratic equation coefficients
      let a = dx * dx + dy * dy;
      let b = 2 * ((x1 - centerX) * dx + (y1 - centerY) * dy);
      let c = (x1 - centerX) * (x1 - centerX) +
        (y1 - centerY) * (y1 - centerY) -
        radius * radius;

      // Solve quadratic equation
      let discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        let t1 = (-b + sqrt(discriminant)) / (2 * a);
        let t2 = (-b - sqrt(discriminant)) / (2 * a);

        // Use t value between 0 and 1
        let t = (t1 >= 0 && t1 <= 1) ? t1 : t2;

        // If point 1 is outside
        if (d1 > radius) {
          x1 = x1 + t * dx;
          y1 = y1 + t * dy;
        }
        // If point 2 is outside
        if (d2 > radius) {
          x2 = x1 + t * dx;
          y2 = y1 + t * dy;
        }
      }
    }

    // Draw the (possibly clipped) edge
    line(x1, y1, x2, y2);
  }
}

function drawSeeds() {
  // Draw the seeds
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

// Function to save the current state as SVG
function saveAsSvg() {
  // Create SVG content
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="black"/>`;

  // Add the boundary circle
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = min(width, height) / 2 - 30;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" 
          fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>`;

  // Add Voronoi edges
  for (let edge of voronoi.edges) {
    let x1 = edge.va.x;
    let y1 = edge.va.y;
    let x2 = edge.vb.x;
    let y2 = edge.vb.y;

    // Get distances from circle center
    let d1 = dist(x1, y1, centerX, centerY);
    let d2 = dist(x2, y2, centerX, centerY);

    // Skip if both points are outside
    if (d1 > radius && d2 > radius) continue;

    // If one point is outside, find intersection
    if (d1 > radius || d2 > radius) {
      let dx = x2 - x1;
      let dy = y2 - y1;
      let a = dx * dx + dy * dy;
      let b = 2 * ((x1 - centerX) * dx + (y1 - centerY) * dy);
      let c = (x1 - centerX) * (x1 - centerX) +
        (y1 - centerY) * (y1 - centerY) -
        radius * radius;

      let discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        let t1 = (-b + sqrt(discriminant)) / (2 * a);
        let t2 = (-b - sqrt(discriminant)) / (2 * a);
        let t = (t1 >= 0 && t1 <= 1) ? t1 : t2;

        if (d1 > radius) {
          x1 = x1 + t * dx;
          y1 = y1 + t * dy;
        }
        if (d2 > radius) {
          x2 = x1 + t * dx;
          y2 = y1 + t * dy;
        }
      }
    }

    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
            stroke="rgba(255,255,255,0.4)" stroke-width="1"/>`;
  }

  // Add seeds
  for (let seed of seeds) {
    svg += `<circle cx="${seed.x}" cy="${seed.y}" r="${seed.size/2}" 
            fill="white"/>`;
  }

  svg += '</svg>';

  // Create a Blob containing the SVG content
  let blob = new Blob([svg], {type: 'image/svg+xml'});
  let url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  let link = document.createElement('a');
  link.href = url;
  link.download = 'phyllotaxis_voronoi.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Add key handler to setup
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveAsSvg();
  }
}
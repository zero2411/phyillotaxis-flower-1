// CodingTrain: https://www.youtube.com/watch?v=KWoJgHFYWxY&t=661s
// Wikipedia: https://en.wikipedia.org/wiki/Phyllotaxis
// Algorithmic Botany - Phyllotaxis: http://algorithmicbotany.org/papers/a...
// https://thesmarthappyproject.com/fibonacci-in-a-sunflower/

let goldenAngle = 137.5 / 1.00; // The golden angle in degrees
let c = 0.6;// constant that affects the spacing of the seeds
let scale = 52;// scale is a scaling factor for the positions of the seeds
let offsetAngle = 5; // offset for seed placement

let cSlider, scaleSlider, offsetSlider;
let seeds = [];// seeds is an array to store the seed objects
let spiralPoints = [];// seeds is an array to store the seed objects
let numberOfSeeds = 21 * 15; // Total number of seeds
let numberOfSpiralPoints = 21 * 17; // Total number of seeds
let minSeedSize = 4; // Minimum seed size
let maxSeedSize = 6; // Maximum seed size
let textSize = 12;  // Font size for seed numbers
let holeSize = 3; // Size of the holes
let seedSize = 6; // Size of the seeds
let triangleSize = 10; // Size of the triangle around each seed

// setup() is called once when the program starts
function setup() {
  // Slider labels
  cLabel = createDiv('Spacing (c):');
  scaleLabel = createDiv('Scale:');
  offsetLabel = createDiv('Offset Angle:');
  cLabel.style('color', '#fff');
  scaleLabel.style('color', '#fff');
  offsetLabel.style('color', '#fff');
  createCanvas(1200, 1200);
  background(0);
  angleMode(DEGREES);

  // Sliders
  cSlider = createSlider(0.1, 2.0, c, 0.01);
  scaleSlider = createSlider(5, 100, scale, 1);
  offsetSlider = createSlider(0, 10, offsetAngle, 0.1);
  cSlider.style('width', '200px');
  scaleSlider.style('width', '200px');
  offsetSlider.style('width', '200px');
  positionSliders();

  updatePattern();
}

function positionSliders() {
  // Place sliders and labels below the canvas
  let yBase = height - 120;
  cLabel.position(10, yBase);
  cSlider.position(10, yBase + 15);
  scaleLabel.position(10, yBase + 35);
  scaleSlider.position(10, yBase + 50);
  offsetLabel.position(10, yBase + 70);
  offsetSlider.position(10, yBase + 90);
}

function windowResized() {
  positionSliders();
}

// draw() is called repeatedly
function draw() {
  // Only redraw if slider values changed
  if (
    c !== cSlider.value() ||
    scale !== scaleSlider.value() ||
    offsetAngle !== offsetSlider.value()
  ) {
    c = cSlider.value();
    scale = scaleSlider.value();
    offsetAngle = offsetSlider.value();
    updatePattern();
  }
}

function updatePattern() {
  background(0);
  seeds = [];
  spiralPoints = [];
  // Recreate seeds and spiral points
  createSeeds(numberOfSeeds);
  createSpiralPoints(numberOfSpiralPoints, offsetAngle);
  // Recompute Voronoi
  voronoi = new Voronoi();
  let bbox = {
    xl: 0,
    xr: width,
    yt: 0,
    yb: height
  };
  let sites = seeds.map(seed => ({ x: seed.x, y: seed.y }));
  voronoi = voronoi.compute(sites, bbox);
  // drawVonoroi();
  // drawHoles();
  drawSpirals();
  drawSeeds();
  drawCenter();

  console.log(`c=${c}, scale=${scale}, offsetAngle=${offsetAngle}`);
}


// Draws 21 parastichy spirals by connecting every 21st seed
const spiralCount = 21;
function drawSpirals() {
  stroke(0, 120, 255);
  strokeWeight(1.5);
  noFill();
  // Clockwise spirals
  for (let s = 0; s < spiralCount; s++) {
    beginShape();
    let cx = width / 2;
    let cy = height / 2;
    curveVertex(cx, cy); // Start at center
    curveVertex(cx, cy); // Start at center
    let x, y;
    for (let i = s; i < spiralPoints.length; i += spiralCount) {
      x = spiralPoints[i].x;
      y = spiralPoints[i].y;
      curveVertex(x, y);
    }
    curveVertex(x, y);
    endShape();
  }

  // Counterclockwise spirals (using opposite parastichy number)
  // Use the next Fibonacci number for classic phyllotaxis
  const ccwSpiralCount = 34; // For 21, use 34 as the opposite
  stroke(0, 255, 120);

  for (let s = 0; s < ccwSpiralCount; s++) {
    beginShape();
    let cx = width / 2;
    let cy = height / 2;
    curveVertex(cx, cy);
    curveVertex(cx, cy);
    let x, y;
    for (let i = s; i < spiralPoints.length; i += ccwSpiralCount) {
      x = spiralPoints[i].x;
      y = spiralPoints[i].y;
      curveVertex(x, y);
    }
    curveVertex(x, y);
    endShape();
  }
}

// Creates the seed objects and stores them in the seeds array
function createSpiralPoints(nSpiralPoints, offsetAngle) {
  for (let n = 0; n < nSpiralPoints; n++) {
    // Calculate the angle and radius for the current seed
    var a = (n * goldenAngle) + offsetAngle;
    var r = c * sqrt(n);
    // Calculate the x/y positions and size of the seed
    var x = width / 2 + r * cos(a) * scale;
    var y = height / 2 + r * sin(a) * scale;
    var dynamicSeedSize = map(n, 0, nSpiralPoints, minSeedSize * c, maxSeedSize * c);
    // Add the seed object to the seeds array
    spiralPoints.push({ x: x, y: y, size: seedSize });
  }
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
    var dynamicSeedSize = map(n, 0, nSeeds, minSeedSize * c, maxSeedSize * c);
    // Add the seed object to the seeds array
    seeds.push({ x: x, y: y, size: seedSize });
  }
}

function drawCenter() {
  // Draw center circle
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 5; // Slightly smaller than canvas
  stroke(255, 100);
  fill(255, 0, 255);
  ellipse(centerX, centerY, radius * 2, radius * 2);
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
  let radius = min(width, height) / 2 - 40; // Slightly smaller than canvas

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

function drawHoles() {
  // Draw 3 holes in a triangle around each seed
  for (let i = 0; i < seeds.length; i++) {
    let seed = seeds[i];
    let triSize = triangleSize; // global variable for triangle size
    let angleOffset = 45; // Point one upwards
    for (let j = 0; j < 3; j++) {
      let angle = angleOffset + j * 90;
      let hx = seed.x + triSize * cos(angle);
      let hy = seed.y + triSize * sin(angle);
      fill(255, 0, 0);
      noStroke();
      ellipse(hx, hy, holeSize, holeSize);
    }
  }

}

// Function to save the current state as SVG
function saveAsSvg() {

  // Create SVG content with groups
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="black"/>`;

  // Add the boundary circle
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = min(width, height) / 2 - 30;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" 
          fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>`;

  // Start Voronoi edges group
  svg += `<g id="voronoi-lines">`;

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
  // End Voronoi edges group
  svg += `</g>`;

  // Start seeds group
  svg += `<g id="seeds">`;
  // Add seeds
  for (let seed of seeds) {
    svg += `<circle cx="${seed.x}" cy="${seed.y}" r="${seed.size / 2}" 
            fill="white"/>`;
  }
  // End seeds group
  svg += `</g>`;

  // Starts holes group
  svg += `<g id="holes">`;
  for (let i = 0; i < seeds.length; i++) {
    let seed = seeds[i];
    let triSize = triangleSize; // global variable for triangle size
    let angleOffset = 45; // Point one upwards
    for (let j = 0; j < 3; j++) {
      let angle = angleOffset + j * 90;
      let hx = seed.x + triSize * cos(angle);
      let hy = seed.y + triSize * sin(angle);
      svg += `<circle cx="${hx}" cy="${hy}" r="${holeSize}" fill="blue"/>`;
    }
  }
  svg += `</g>`;

  // Add spirals to SVG as smooth Bezier curves
  function bezierSpiralPath(points) {
    if (points.length < 2) return '';
    let d = M `${points[0].x} ${points[0].y}` ;
    for (let i = 1; i < points.length - 2; i++) {
      let p0 = points[i - 1];
      let p1 = points[i];
      let p2 = points[i + 1];
      let p3 = points[i + 2];
      // Catmull-Rom to Bezier conversion
      let cp1x = p1.x + (p2.x - p0.x) / 6;
      let cp1y = p1.y + (p2.y - p0.y) / 6;
      let cp2x = p2.x - (p3.x - p1.x) / 6;
      let cp2y = p2.y - (p3.y - p1.y) / 6;
      d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}` ;
    }
    return d;
  }

  // CW spirals
  svg += `<g id="spirals-cw">`;
  for (let s = 0; s < spiralCount; s++) {
    let cx = width / 2;
    let cy = height / 2;
    let spiralPts = [{ x: cx, y: cy }];
    for (let i = s; i < spiralPoints.length; i += spiralCount) {
      spiralPts.push({ x: spiralPoints[i].x, y: spiralPoints[i].y });
    }
    let spiralPath = bezierSpiralPath(spiralPts);
    svg += `<path d="${spiralPath}" stroke="blue" stroke-width="1.5" fill="none"/>`;
  }
  svg += `</g>`;

  // CCW spirals
  svg += `<g id="spirals-ccw">`;
  const ccwSpiralCount = 34;
  for (let s = 0; s < ccwSpiralCount; s++) {
    let cx = width / 2;
    let cy = height / 2;
    let spiralPts = [{ x: cx, y: cy }];
    for (let i = s; i < spiralPoints.length; i += ccwSpiralCount) {
      spiralPts.push({ x: spiralPoints[i].x, y: spiralPoints[i].y });
    }
    let spiralPath = bezierSpiralPath(spiralPts);
    svg += `<path d="${spiralPath}" stroke="lime" stroke-width="1.5" fill="none"/>`;
  }
  svg += `</g>`;


  // Start text group with smaller font size for numbers
  svg += `<g id="seed-numbers" style="font-family: Arial; font-size: ${textSize}px; fill: red; text-anchor: middle; dominant-baseline: central">`;
  // Add numbers for each seed
  seeds.forEach((seed, index) => {
    svg += `<text x="${seed.x}" y="${seed.y + (textSize / 2)}">${index}</text>`;
  });
  // End text group
  svg += `</g>`;

  svg += '</svg>';

  // Create a Blob containing the SVG content
  let blob = new Blob([svg], { type: 'image/svg+xml' });
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
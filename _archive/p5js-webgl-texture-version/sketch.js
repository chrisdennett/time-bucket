// this sketch holds on to a collection of old frames in order to create a slitscan effect
// it actually doesn't use a shader but it's often lumped in with graphics things so here it is

// the camera variable
let cam;

let pastFrames = []; // an array to store old frames
let numFrames = 100; // how many frames to store. We will run out of memory at a certain point so don't make this too big

// the width and height of our past frames
// we make them smaller so that we can store more
// at the expense of image quality
let w = 512;
let h = 512;

let smallestDiameterSlider;
let stepsSlider;
let isReversedCheckbox;
let isReversed;
let tempImg;
let isSquareCheckbox;
let isSquare;

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // initialize the webcam at the window size
  cam = createCapture(VIDEO);
  cam.size(windowWidth, windowHeight);

  // hide the html element that createCapture adds to the screen
  cam.hide();

  smallestDiameterSlider = createSlider(0, 1, 0.2, 0.01);
  smallestDiameterSlider.position(10, 10);
  smallestDiameterSlider.style("width", "200px");

  stepsSlider = createSlider(1, 300, 250, 1);
  stepsSlider.position(10, 40);
  stepsSlider.style("width", "200px");

  isReversedCheckbox = createCheckbox("isReversed", false);
  isReversedCheckbox.position(10, 70);
  isReversedCheckbox.changed(isReversedToggle);

  isSquareCheckbox = createCheckbox("isSquare", false);
  isSquareCheckbox.position(10, 90);
  isSquareCheckbox.changed(isSquareToggle);

  isSquare = false;
  isReversed = false;

  // for every frame, add a graphics layer
  for (let i = 0; i < numFrames; i++) {
    let p = createGraphics(w, h);
    pastFrames.push(p);
  }

  tempImg = createGraphics(w, h, WEBGL);
}

function isReversedToggle() {
  isReversed = this.checked();
}

function isSquareToggle() {
  isSquare = this.checked();
}

function draw() {
  translate(-width / 2, -height / 2);

  // if number of steps change
  let totalSteps = stepsSlider.value();
  if (totalSteps < pastFrames.length) {
    let removeSteps = pastFrames.length - totalSteps;
    pastFrames = pastFrames.slice(removeSteps);
  } else if (totalSteps > pastFrames.length) {
    let totalNewSteps = totalSteps - pastFrames.length;
    for (let i = 0; i < totalNewSteps; i++) {
      let p = createGraphics(w, h);
      pastFrames.push(p);
    }
  }

  // draw the current camera frame in the first element of the array
  pastFrames[0].image(cam, 0, 0, w, h);

  // move every element forward by 1, except the last element
  for (let i = 0; i < pastFrames.length - 1; i++) {
    pastFrames[i] = pastFrames[i + 1];
  }

  let smallestDiam = smallestDiameterSlider.value() * windowWidth;
  let largestDiam = windowWidth;
  let diamStep = (largestDiam - smallestDiam) / pastFrames.length;

  // translate(width, 0);
  // scale(-1, 1);

  let frameIndex;

  for (let i = 0; i < pastFrames.length; i++) {
    if (isReversed) {
      frameIndex = pastFrames.length - i - 1;
    } else {
      frameIndex = i;
    }

    const srcImg = pastFrames[frameIndex];
    const outWidth = width - i * diamStep;

    // tempImg.background(255, 0, 255);
    tempImg.texture(srcImg);
    // tempImg.scale(1, 2);
    tempImg.rect(0, 0, srcImg.width, srcImg.height);

    texture(srcImg);
    let centerX = width / 2 - outWidth / 2;
    let centerY = height / 2 - outWidth / 2;

    if (isSquare) {
      rect(centerX, centerY, outWidth, outWidth);
    } else {
      circle(width / 2, height / 2, outWidth);
    }
  }

  // move the last element to the beginning
  pastFrames[pastFrames.length - 1] = pastFrames[0];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  step = h / numFrames;
}

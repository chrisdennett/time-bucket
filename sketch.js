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
let checkbox;
let isReversed;

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

  checkbox = createCheckbox("isReversed", false);
  checkbox.position(10, 70);
  checkbox.changed(myCheckedEvent);

  isReversed = false;

  // for every frame, add a graphics layer
  for (let i = 0; i < numFrames; i++) {
    let p = createGraphics(w, h);
    pastFrames.push(p);
  }
}

function myCheckedEvent() {
  isReversed = this.checked();
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

  let smallestDiam = smallestDiameterSlider.value() * width;
  let largestDiam = width;
  let diamStep = (largestDiam - smallestDiam) / pastFrames.length;

  translate(width, 0);
  scale(-1, 1);

  for (let i = 0; i < pastFrames.length; i++) {
    if (isReversed) {
      texture(pastFrames[pastFrames.length - i - 1]);
    } else {
      texture(pastFrames[i]);
    }

    circle(width / 2, height / 2, width - i * diamStep);
  }

  // move the last element to the beginning
  pastFrames[pastFrames.length - 1] = pastFrames[0];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  step = h / numFrames;
}

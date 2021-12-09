/* eslint-disable no-undef, no-unused-vars */

let theShader;
let webcam;
let columnSlider;

function preload() {
  // load the shader
  theShader = loadShader("effect.vert", "effect.frag");
}

function setup() {
  // ensure all screens are using the same pixel density
  pixelDensity(1);
  // shaders require WEBGL mode to work
  createCanvas(1280, 1024, WEBGL);

  // set up slider
  columnSlider = createSlider(4, 150, 64);
  columnSlider.position(10, 10);
  columnSlider.style("width", "180px");

  // initialize the webcam at the window size
  webcam = createCapture(VIDEO);
  webcam.size(1280, 1024);

  // hide the html element that createCapture adds to the screen
  webcam.hide();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(theShader);

  // lets just send the webcam to our shader as a uniform
  theShader.setUniform("webcamTexture", webcam);

  const totalColumns = columnSlider.value();
  theShader.setUniform("totalColumns", totalColumns);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(1280, 1024);
}

/* eslint-disable no-undef, no-unused-vars */

// the shader variable
let theShader;

// the camera variable
let webcam;

function preload() {
  // load the shader
  theShader = loadShader("effect.vert", "effect.frag");
}

function setup() {
  // ensure all screens are using the same pixel density
  pixelDensity(1);
  // shaders require WEBGL mode to work
  createCanvas(1280, 1024, WEBGL);
  noStroke();

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

  // lets send the resolution, mouse, and time to our shader
  // before sending mouse + time we modify the data so it's more easily usable by the shader
  // theShader.setUniform("resolution", [width, height]);
  // theShader.setUniform("mouse", map(mouseX, 0, width, 0, 7));
  // theShader.setUniform("time", frameCount * 0.01);
  theShader.setUniform("totalCols", 4);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(1280, 1024);
}

// These are necessary definitions that let you graphics card know how to render the shader
precision mediump float;

varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D webcamTexture;

// number of columns coming from p5
uniform float totalColumns;

// REMEMBER CHRIS - THIS IS ALL FROM THE POINT OF VIEW OF A PIXEL
void main() {
  // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixel's location
  // we can use it to access every pixel on the screen
  vec2 coord = vTexCoord;

  // it come in flipped on x and y so correct it like so
  coord = 1.0 - coord;
  // this is like:
  // coord.x = 1.0 - coord.x;
  // coord.y = 1.0 - coord.y;

  float cellSize = 1.0 / float(totalColumns);

  // find out which cell this pixel is in
  float currCol = floor(coord.x / cellSize) + 1.0;
  float currRow = floor(coord.y / cellSize) + 1.0;

  // grab the pixel position at the top left of each webcam cell
  float textureX = currCol/float(totalColumns);
  float textureY = currRow/float(totalColumns);

  vec2 gridCord = vec2(textureX, textureY);

  // get the webcam as a vec4 using texture2D and plug in our distored uv's
  vec4 tex = texture2D(webcamTexture, gridCord);

  // calculate a grey using the average of all three colours
  float grey = (tex.r + tex.g + tex.b) / 3.0;
  // lowest grey value is darkest: 0.0 - black
  // highest grey value is lightest: 1.0 - white
  float brightness = grey;

  // determine if pixel is within a square scaled by brightness
  float brightnessSize = cellSize * brightness;
  float brightnessSquarePadding = (cellSize - brightnessSize) / 2.0;
  float xPosInCell = textureX - coord.x;
  float yPosInCell = textureY - coord.y;
  bool pixelIsInsideBrightnessSquare = true;
  bool pixelInLeftPadding = xPosInCell < brightnessSquarePadding;
  bool pixelInTopPadding = yPosInCell < brightnessSquarePadding;
  bool pixelInRightPadding = xPosInCell > brightnessSize + brightnessSquarePadding;
  bool pixelInBottomPadding = yPosInCell > brightnessSize + brightnessSquarePadding;

  vec3 cellColor = vec3(0.0);

  if(pixelInLeftPadding){
    pixelIsInsideBrightnessSquare = false;
    // cellColor = vec3(1.0, 0.0, 0.0);
  }
  if(pixelInTopPadding){
    pixelIsInsideBrightnessSquare = false;
    // cellColor = vec3(0.0, 1.0, 0.0);
  }
  if(pixelInRightPadding){
    pixelIsInsideBrightnessSquare = false;
    // cellColor = vec3(0.0, 0.0, 1.0);
  }
  if(pixelInBottomPadding){
    pixelIsInsideBrightnessSquare = false;
    // cellColor = vec3(1.0, 0.0, 1.0);
  }


  if(pixelIsInsideBrightnessSquare){
    cellColor = vec3(1.0);
  }

  gl_FragColor = vec4(cellColor, 1.0);
}

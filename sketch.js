// Maze game 
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// Walker OOP Demo

//ignore
// function preload() {
//   hallOne = loadImage('hallway 1.png');S
//   hallTwo = loadImage('hall 2.png');
//   hallThree = loadImage('hall 3.png');
// }
// ------------------------------------------


// create the map layout using a 2D ARRAY
// Capital X marks a wall, P marks the player's starting position
//lower case e in an enemy 
const GAME_MAP = [
  "XXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXX",
  "X        C                e      X",
  "X                                X",
  "X       XXXXXXX   XXX            X",
  "X       X           X            X",
  "XX     X   XX  X   X    X XXXX   X",
  "X       X   Xe  X   X        X   X",
  "X       X   XXXXX   X       eX   X", 
  "X       X           X     XXXX   X",
  "X       XXXXXXXXXXXXX            X",
  "X  e                             X",
  "X                                X",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
];

const GRID_SIZE = 150;
const PERSONAL_SPACE = 50;
const RUN_SPEED = -25;
const WALK_SPEED = -10;
const MOUSE_SENSITIVITY = 0.0001;
const CAM_X = 100;
const CAM_Y = -75;
const CAM_Z = 50;

let wallTexture;
let walls = [];
let player;
let enemies = [];
let icecream = [];
let isStopped = true;

function preload() {
  sky = loadImage("sky.png");
  grass = loadImage("grass.png");
  cball = loadImage("cball.png");
  ground = loadImage("ground.jpg");
  wall = loadImage("wall.jpg");
  yummycone = loadImage("cone.jpg");
  soundFormats('mp3', 'ogg');
  mySound = loadSound('walking');
  longWalk = loadSound('long walking sound.mp3');
}


function setup() {
  // set canvas to WEBGl so render things in 3d
  createCanvas(920, 600, WEBGL);
  cursor(CROSS);

  //game layout
  //looping through arrays to look up what tile object is at that very position
  for (let z = 0; z < GAME_MAP.length;  z ++){
    for (let x = 0; x < GAME_MAP[z].length; x++) {
      let tile = GAME_MAP[z][x];
      //use GRID_SIZE const to create each tile as a square thats 150 x 150 pixels
      let worldX = (x - GAME_MAP[z].length / 2) * GRID_SIZE;
      let worldZ = (z - GAME_MAP.length / 2) * GRID_SIZE;
      // switch is like an "else if" statement but better to use with 3 or more options 
      // "case" holds the options 
      // basically checking the grid for symbols and initializing the right class for each
      switch (tile) {
        case "p":
          player = new Player(worldX, worldZ);
          break;
        case "e":
          enemies.push(new Enemy(worldX, worldZ));
          break;
        case "X":
          walls.push(new Wall(worldX, worldZ, GRID_SIZE, 200, GRID_SIZE));
          break;
        case "C":
          icecream.push(new iceCreamCone(worldX, worldZ));
          break;
      }
    }
  }
}

function draw() {
  background("blue");

  // basic lighting using the 3d p5js program

  ambientLight(150);
  directionalLight(180, 180, 180, 0, 0, -1);

  // draw interior
  // see what this does cause its not an already existing function
  drawFloor();
  //loop through each wall so we can move through it 
  walls.forEach((wall) => wall.display());

  //draw player and enemies
  player.turnTowardsMouse();
  player.moveForward();
  player.updateCamera();

  enemies.forEach((enemy) => enemy.display());
  icecream.forEach((iccone) => iccone.display());
  
  walkSound();
  
}

function walkingSound() {
  if (keyIsDown(UP_ARROW) === true ) {
    if (isStopped === true) {
      // If the beat is stopped, play it.
      longWalk.play();
      isStopped = false;
    } else {
      // If the beat is playing, stop it.
      longWalk.stop();
      isStopped = true;
    }
  }
}

// function walkingSound() {
//   if (isStopped === true) {
//     text('Click to start', 50, 50);
//   } else {
//     text('Click to stop', 50, 50);
//   }
// }

// function mousePressed() {
//   if (keyIsDown(UP_ARROW) === true) {
//     // If the beat is stopped, play it.
//     longWalk.play();
//     isStopped = false;
//   } else {
//     // If the beat is playing, stop it.
//     longWalk.stop();
//     isStopped = true;
//   }
// }

class Player {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.direction = -1; // direction the player is facing
    this.isMovingForward = false;
    this.isRunning = false;
  }

  moveForward() {
    if (!this.isMovingForward) {
      return;
    }
    let speed = this.isRunning ? RUN_SPEED : WALK_SPEED;
    let newX = this.x + Math.sin(this.direction) * speed;
    let newZ = this.z + Math.cos(this.direction) * speed;
    if (!this.checkCollision(newX, newZ)) {
      this.x = newX;
      this.z = newZ;
    }
  }

  checkCollision(newX, newZ) {
    for (let wall of walls) {
      if (
        newX > wall.x - (wall.w / 2 + PERSONAL_SPACE) &&
        newX < wall.x + (wall.w / 2 + PERSONAL_SPACE) &&
        newZ > wall.z - (wall.d / 2 + PERSONAL_SPACE) &&
        newZ < wall.z + (wall.d / 2 + PERSONAL_SPACE)
      ) {
        return true;
      }
    }
    return false;
  }

  turnTowardsMouse() {
    // check if mouse is outside the canvas and ask it to return early if it is 
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
      return;
    }

    // Only turn if mouse is on edge of canvas.
    const noTurnZoneStart = (width * 2) / 5;
    const noTurnZoneEnd = (width * 3) / 5;
    if (mouseX < noTurnZoneStart || mouseX > noTurnZoneEnd) {
      let mouseDelta = mouseX - width / 2;
      this.direction -= mouseDelta * MOUSE_SENSITIVITY;
    }
  }

  updateCamera() {
    // search up how this part works cause i have no idea tbh
    //a bunch of math 
    let camX = this.x + Math.sin(this.direction) * CAM_X;
    let camZ = this.z + Math.cos(this.direction) * CAM_Z;
    let lookX = this.x - Math.sin(this.direction);
    let lookZ = this.z - Math.cos(this.direction);
    camera(camX, CAM_Y, camZ, lookX, CAM_Y, lookZ, 0, 1, 0);
  }
}


function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      player.isMovingForward = true;
      break;
    case SHIFT:
      player.isRunning = true;
      break;
  }
  walkSound();
}

function walkSound() {
  if (keyIsDown(UP_ARROW) === true) {
    mySound.play();
  }
}

function keyReleased() {
  switch (keyCode) {
    case UP_ARROW:
      player.isMovingForward = false;
      break;
    case SHIFT:
      player.isRunning = false;
      break;
  }
}

class Wall {
  // find out where to display wall
  constructor(x, z, w, h, d) {
    this.x = x;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  //display wall texture 
  //draw the wall as a box in 3d
  //this is prob cheating since it's not actually raycasting its just 
  //using the built in 3d program in p5js
  display() {
    push();
    translate(this.x, -this.h / 2, this.z);
    texture(wall);
    //drawing the wall as a box in 3d space
    box(this.w, this.h, this.d);
    pop();
  }
}


function drawFloor() {
  push();
  noStroke();
  // fill("green");
  translate(0, 0, 0);
  // use half pi to rotate it 90 degrees so the floor isnt on the side
  // functions like rotate and orbitControl help 
  rotateX(HALF_PI);
  //draw a 4-sided flat shape with every angle mesuring 90 degrees
  // basically a 2d shape that can be rotated on a 3d plane
  texture(grass);
  plane(width * 10, height * 10);
  pop();
}

class iceCreamCone {
  constructor(x, z) {
    // no y position since everything is on the ground
    this.x = x;
    this.z = z;
    //radius 
    this.r = 50;
  }
  display() {
    //search up how this push and pop thing works 
    push();
    // make a seamless ball
    noStroke();
    //move origin so enemy spawn in the right postion
    translate(this.x, -this.r, this.z);
    texture(yummycone);
    cone(this.r);
    pop();
  }
}


class Enemy {
  constructor(x, z) {
    // no y position since everything is on the ground
    this.x = x;
    this.z = z;
    //radius 
    this.r = 50;
  }



  display() {
    //search up how this push and pop thing works 
    push();
    // make a seamless ball
    noStroke();
    //move origin so enemy spawn in the right postion
    translate(this.x, -this.r, this.z);
    texture(ground);
    sphere(this.r);
    pop();
  }
}
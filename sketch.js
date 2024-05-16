// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// Walker OOP Demo

//ignore
// function preload() {
//   hallOne = loadImage('hallway 1.png');
//   hallTwo = loadImage('hall 2.png');
//   hallThree = loadImage('hall 3.png');
// }
// ------------------------------------------


// create the map layout using a 2D ARRAY
// Capital X marks a wall, P marks the player's starting position
//lower case e in an enemy 
const GAME_MAP = [
  "XXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXX",
  "X                         e      X",
  "X                       p        X",
  "X       XXXXXXX   XXX            X",
  "X       X           X            X",
  "X       X   XX  X   X     XXXX   X",
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

function preload() {
  wallTexture = loadImage("hallway 1.png");
}

function setup() {
  // set canvas to WEBGl so render things in 3d
  createCanvas(920, 600, WEBGL);

  //game layout
  //looping through arrays to look up what tile object is at that very position
  for (let z = 0; z < GAME_MAP, length;  z ++){
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
          // break terminates current loop or statement
          break;
        case "e":
          enemies.push(new Enemy(worldX, worldZ));
          break;
      }
    }
  }
}

function draw() {
  background("blue");

  player.updateCamera();

  enemies.forEach((enemy) => enemy.display());
}

class Player {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    // where the player is facing
    this.direction = -1; 
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
    fill("red");
    sphere(this.r);
    pop();
  }
}
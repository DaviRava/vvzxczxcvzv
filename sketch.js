var canvas;
var backgroundImage;
var bgImg;
var database;
var form;
var player, playerCount, allPlayers;
var gameState
var carro1, carro2;
var carro1IMG, carro2IMG;
var pistaIMG;
var obstacle1Image, obstacle2Image;

var coinIMG, fuelIMG;

var Gcoin, Gfuel, Gobs;

var lifeIMG

var allCars = [];


function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carro1IMG = loadImage("./assets/car1.png");
  carro2IMG = loadImage("./assets/car2.png");
  pistaIMG = loadImage("./assets/PISTA.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  coinIMG = loadImage("./assets/goldCoin.png");
  fuelIMG = loadImage("./assets/fuel.png");
  lifeIMG = loadImage("./assets/life.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update (1)
  }

  if (gameState === 1) {
    game.play()
    
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

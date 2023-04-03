var canvas;
var cenario, form;
var database;
var allPlayers;
var carimg1, carimg2;
var pista, player;
var car1, car2;
var cars = [];
var linhaChegada = 0;
//declarar as variáveis playerCount e gameState
var playerCount = 0;
var gameState = 0;
var coins, fuels, coinImg, fuelImg, lifeImg;
var obsG1, obsG2, obsImg1, obsImg2;
var blastImg;

function preload() {
  cenario = loadImage("./assets/planodefundo.png");
  carimg1 = loadImage("car1.png");
  carimg2 = loadImage("car2.png");
  pista = loadImage("track.png");
  
  //carregar as imagens da moeda e do combustível
  coinImg = loadImage("goldCoin.png");
  fuelImg = loadImage("fuel.png");

  //carrega as imagens dos obstáculos...
  obsImg1 = loadImage("pneus.png");
  obsImg2 = loadImage("cones.png");

  //carregando a imagem de coração...
  lifeImg = loadImage("life.png");
  //carregando a imagem da explosão..
  blastImg = loadImage("blast.png");
  

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
 
  game = new Game();
  game.start();
  game.getState();
}

function draw() {
  background(cenario);

  if(playerCount == 2){
    game.update(1);
  }

  if(gameState == 1){
    game.play();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

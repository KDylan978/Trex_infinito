var trex ,trex_running, trex_collided;
var obs, cactus, cactus2, cactus3, cactus4, cactus5, cactus6;
var floor, invis_ground, ground;
var cloud, cloudIMG;
var rand;
var jumping = false;
var END = 0;
var PLAY = 1;
var obsGroup, cloudGroup;
var gameState = 1;
var aux = 0;
var score;
var gameOverImg, restartImg, gameOver, restart;
var jumpSound, dieSound, checkSound;
var touches = [];
function preload()
{
  cloudIMG = loadImage("cloud.png");
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png")
  cactus = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  floor = loadAnimation("ground2.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkpoint.mp3");
}

function setup()
{
  
  createCanvas(windowWidth, windowHeight)
  
  //crear sprite de Trex
  trex = createSprite(150, height - 80, 30, 70);

  //poniendo animaciones
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  invis_ground = createSprite(150, height - 62, 10, 20);
  invis_ground.visible = false;
  ground = createSprite(300, height - 75, 600, 20);
  ground.addAnimation("ground", floor);

  //otras cosas
  ground.velocityX = -6;
  World.frameRate = 60;
  score = 0;

  //grupos
  obsGroup = createGroup();
  cloudGroup = createGroup();

  trex.setCollider("circle", 0, 0, 40);
}

function draw()
{
  background("white");

  //estados del juego
  if (gameState == PLAY)
  {
    if(aux == 1)
    {
      ground.velocityX = -6;
      aux = 0;
    }
    if(touches.lenght > 0 || (keyDown("space") || keyDown("UP")) && jumping == false)
    {
      trex.velocityY = -10;
      jumping = true;
      jumpSound.play();
      touches = []
    }
    trex.velocityY += 0.4;
    if(trex.isTouching(invis_ground))
    {
      jumping = false;
    }
    if(ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    score += 0.5;
    if(trex.isTouching(obsGroup))
    {
      gameState = END;
      dieSound.play();
    }
    if(score % 500 == 0 && score > 0)
    {
      checkSound.play();
    }
    spawnClouds();
    spawnObstacles();
  }
  else
  {
    if(aux == 0)
    {
      gameOver = createSprite(width / 2, (height / 2) - 50, 20, 20);
      restart = createSprite(width / 2, (height / 2) + 40, 20, 20);
      gameOver.addImage("game_over", gameOverImg);
      gameOver.scale = 0.8;
      restart.addImage("restart", restartImg);
      restart.scale = 0.6;
      trex.changeAnimation("collided", trex_collided);
      trex.velocityY = 5;
      aux++;
    }
    if(mousePressedOver(restart))
    {
      gameState = PLAY;
      score = 0;
      trex.changeAnimation("running", trex_running);
      obsGroup.destroyEach();
      cloudGroup.destroyEach();
      gameOver.destroy();
      restart.destroy();
    }
    ground.velocityX = 0;
    obsGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obsGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
  }
  text("puntuación: " + int(score), width - 100, 25);
  trex.collide(invis_ground);
  drawSprites();
}

//nubes
function spawnClouds()
{
  if(frameCount%120 === 0)
  {
    rand = Math.round(random(height - 350, height - 300));
    cloud = createSprite(width + 20, rand, 40, 10);
    cloud.addImage("cloud", cloudIMG);
    cloud.scale = 0.8;
    cloud.lifetime = 455;
    cloud.velocityX = -3;
    cloud.depth = 0;
    cloudGroup.add(cloud);
  }
}

//obstáculos
function spawnObstacles()
{
  if (frameCount%100 === 0)
  {
    aux = 0;
    rand = Math.round(random(width + 20, width + 60));
    var obs = createSprite(rand, height - 100, 25, 25);
    obs.velocityX = (-6);
    rand = Math.round(random(1, 6));
    switch (rand) 
    {
      case 1:
        obs.addImage("obstacle", cactus);
        obs.scale = 0.8;
        break;
      case 2:
        obs.addImage("obstacle", cactus2);
        obs.scale = 0.8;
        break;
      case 3:
        obs.addImage("obstacle", cactus3);
        obs.scale = 0.8;
        break;
      case 4:
        obs.addImage("obstacle", cactus4);
        obs.scale = 0.6;
        break;
      case 5:
        obs.addImage("obstacle", cactus5);
        obs.scale = 0.6;
        break;
      case 6:
        obs.addImage("obstacle", cactus6);
        obs.scale = 0.6;
        break;
      default: 
        break;
    }
    obs.lifetime = 300;
    obsGroup.add(obs);
    trex.depth += 1;
  }
}
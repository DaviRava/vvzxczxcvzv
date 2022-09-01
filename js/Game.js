class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
  }
  start() {
    form = new Form();
    form.display();

    player = new Player();
    playerCount = player.getCount();


    carro1 = createSprite(width / 2 - 100, height - 100)
    carro1.addImage("carro1IMG", carro1IMG)
    carro1.scale = 0.1

    carro2 = createSprite(width / 2 + 100, height - 100)
    carro2.addImage("carro2IMG", carro2IMG)
    carro2.scale = 0.1

    allCars = [carro1, carro2];

    Gfuel = new Group()
    Gcoin = new Group()
    Gobs = new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprites(Gcoin, 25, coinIMG, 0.09)
    this.addSprites(Gfuel, 3, fuelIMG, 0.03)
    this.addSprites(Gobs, obstaclesPositions.length, obstacle1Image, 0.05, obstaclesPositions)
  }

  getState() {
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value", function (data) {
      gameState = data.val()
    })
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    })
  }

  play() {
    Player.getPlayersInfo()
    this.handleElements()
    this.resetB()
    if (allPlayers !== undefined) {
      image(pistaIMG, 0, -height * 5, width, height * 6)

      this.showLeaderboard()
      this.showFuelBar()
      this.showLife()

      var index = 0
      for (var i in allPlayers) {
        index += 1
        var x = allPlayers[i].positionX
        var y = height - allPlayers[i].positionY
        allCars[index - 1].position.x = x
        allCars[index - 1].position.y = y
        if (index === player.index) {
          stroke("cyan")
          fill("darkgrey")
          ellipse(x, y, 60, 60)
          camera.position.y = allCars[index - 1].position.y
          this.randomFuel(index)
          this.randomCoin(index)

        }
      }

      drawSprites()
      
      if (!this.playerMoving) {
        player.positionY += 5
        player.update()
        
      }

      this.handlePlayer()

      const finishLine = height * 6 - 100
      if (player.positionY > finishLine) {
        gameState = 2
        player.rank += 1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.mostrarRank()
      }


    }
  }

  handlePlayer() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10
      player.update()
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 180) {
      player.positionX += 5
      player.update()
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5
      player.update()
    }
  }

  handleElements() {
    form.hide()
    form.titleImg.position(40, 50)
    form.titleImg.class("gameTitleAfterEffect")

    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

  }

  showLeaderboard() {
    var leader1, leader2;
    //retorna matriz de valores enumeraveis dos objetos
    var players = Object.values(allPlayers);
    //verifica se o jogador 1 está no rank 1
    if ((players[0].rank === 0 && players[1].rank === 0)
      || players[0].rank === 1) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      //exibe o texto na tela por ordem de jogador
      leader1 = players[0].rank +
        "&emsp;" + players[0].name +
        "&emsp;" + players[0].score;

      leader2 = players[1].rank +
        "&emsp;" + players[1].name +
        "&emsp;" + players[1].score;
    }

    //verifica se o jogador 2 está no rank 1
    if (players[1].rank === 1) {
      leader1 = players[1].rank +
        "&emsp;" + players[1].name +
        "&emsp;" + players[1].score;

      leader2 = players[0].rank +
        "&emsp;" + players[0].name +
        "&emsp;" + players[0].score;
    }

    //passar lideres como elementos html
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  resetB() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      })
      window.location.reload();
    })


  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //Se a matriz NÃO  estiver vazia
      // adicionar as posições da matriz à x e y
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;

      } else {

        //aleatório para as metades da tela em x e y
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);

      }

      //criar sprite nas posições aleatórias
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);

    }
  }

  randomFuel(index) {
    allCars[index - 1].overlap(Gfuel, function (collector, collected) {
      player.fuel = 185;
      collected.remove();
    })
    if (player.fuel > 0 && !this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel<=0) {
      gameState = 2;
      this.gameOver();  
    }
  }

  randomCoin(index) {
    allCars[index - 1].overlap(Gcoin, function (collector, collected) {
      player.score += 2;
      collected.remove();
    })
  }

  mostrarRank() {
    swal({
      //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  showLife() {
    push();
    image(lifeIMG, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#C2331D");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }

  //barra combustivel
  showFuelBar() {
    push();
    image(fuelIMG, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  //final de jogo
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
}

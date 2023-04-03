class Game{
    constructor(){
        this.botao = createButton("");
        
        this.tituloPlacar = createElement("h2");
        this.lugar1 = createElement("h2");
        this.lugar2 = createElement("h2");
        
        this.movendo = false;
        this.esquerda = false;
        this.blast = false;

    }
    posicionar(){
        this.botao.position(width*0.66, 100);
        this.botao.class("resetButton");
        
        //definir a posição do elemento
        this.tituloPlacar.position(width*0.33,50);
        this.tituloPlacar.class("resetText");
        this.tituloPlacar.html("PLACAR");

        this.lugar1.position(width * 0.33, 100);
        this.lugar1.class("leadersText");

        this.lugar2.position(width * 0.33, 150);
        this.lugar2.class("leadersText");
        
        //define o que ocorre quando clica nele
        this.botao.mousePressed(()=>{
            //indica a raiz do banco de dados
            database.ref("/").set({
                //escreve esses valores no banco
                gameState:0, playerCount:0,vencedores:0
            });
            //recarrega a página local
            window.location.reload();
        });
    }

    mostrarPlacar(){
        //MATRIZ DE OBJETOS DE JOGADORES
        var players = Object.values(allPlayers);
        var lugar1, lugar2;
        //situação 1: ninguém cruzou a linha de chegada
        if(players[0].rank == 0 && players[1].rank == 0){
            //primeiro lugar: jogador 0
            lugar1 = players[0].rank 
             + "&emsp;"
             + players[0].nome 
             + "&emsp;" 
             + players[0].score;
            //segundo lugar: jogador 1
            lugar2 = players[1].rank 
            + "&emsp;" 
            + players[1].nome 
            + "&emsp;" 
            + players[1].score;
        }
        //SITUAÇÃO B: o player 0 cruzou a linha de chegada
        if(players[0].rank == 1){
            //primeiro lugar: jogador 0
            lugar1 = players[0].rank 
             + "&emsp;"
             + players[0].nome 
             + "&emsp;" 
             + players[0].score;
            //segundo lugar: jogador 1
            lugar2 = players[1].rank 
            + "&emsp;" 
            + players[1].nome 
            + "&emsp;" 
            + players[1].score;
        }
        //SITUAÇÃO C: o player 1 cruzou a linha de chegada primeiro
        if(players[1].rank == 1){
            //primeiro lugar: jogador 1
            lugar1 = players[1].rank 
             + "&emsp;"
             + players[1].nome 
             + "&emsp;" 
             + players[1].score;
            //segundo lugar: jogador 0
            lugar2 = players[0].rank 
            + "&emsp;" 
            + players[0].nome 
            + "&emsp;" 
            + players[0].score;
        }

        this.lugar1.html(lugar1);
        this.lugar2.html(lugar2);
    }



    
    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        //pega a quantidade de jogadores no bd
        player.getCount();

        //cria a sprite do carro1
        car1 = createSprite(width/2 - 100, height-100);
        car1.addImage("carro", carimg1);
        car1.addImage("blast", blastImg);
        car1.scale = 0.07;

        //cria a sprite do carro2
        car2 = createSprite(width/2 + 100, height-100);
        car2.addImage("carro", carimg2);
        car2.addImage("blast", blastImg);
        car2.scale = 0.07;

        //adiciona as duas sprites na matriz cars
        cars = [car1, car2];

        //definir os grupos....
        coins = new Group();
        fuels = new Group();
        obsG1 = new Group();
        obsG2 = new Group();

        var obstacles1 = [
            { x: width / 2 - 150, y: height - 1300, image: obsImg1  },
            { x: width / 2 + 250, y: height - 1800, image: obsImg1 },
            { x: width / 2 - 180, y: height - 3300, image: obsImg1 },
            { x: width / 2 - 150, y: height - 4300, image: obsImg1 },
            { x: width / 2, y: height - 5300, image: obsImg1 },
            { x: width / 2 - 180, y: height - 5500, image: obsImg1 }
        ];
        var obstacles2 = [
            { x: width / 2 + 250, y: height - 800, image: obsImg2 },
            { x: width / 2 - 180, y: height - 2300, image: obsImg2 },
            { x: width / 2, y: height - 2800, image: obsImg2 },
            { x: width / 2 + 180, y: height - 3300, image: obsImg2 },
            { x: width / 2 + 250, y: height - 3800, image: obsImg2 },
            { x: width / 2 + 250, y: height - 4800, image: obsImg2 },
        ];
        //criando as sprites...
        this.addSprites(coins, coinImg, 35, 0.5);
        this.addSprites(fuels, fuelImg, 20, 0.02);
        //adicionando o primeiro grupo de obstáculos....
        this.addSprites(obsG1, obsImg1, obstacles1.length, 0.04, obstacles1)
        this.addSprites(obsG2, obsImg2, obstacles2.length, 0.04, obstacles2)

    }
    addSprites(grupo, imagem, numero, tamanho, posicoes = []){
        
        for(var i = 0; i < numero; i++){
            var x = 0;
            var y = 0;
            //checar se há elementos na matriz posicoes
            if(posicoes.length > 0){
                //se sim, usará os valores da matriz para definir x e y
                x = posicoes[i].x;
                y = posicoes[i].y;
            }
            //senão, irá gerar números aleatórios para definir x e y
            else{
                x = random(width*0.33, width*0.66);
                y = random(-height*5, height - 100);
            }
           //cria a sprite
           var sprite = createSprite(x,y);
           //adiciona a imagem na sprite
           sprite.addImage(imagem);
           sprite.scale = tamanho;
           grupo.add(sprite);
        }

    }

    colidiu(i){
        //checa se o carro colidiu com cone ou colidiu com o pneu
        if(cars[i-1].collide(obsG1) || cars[i-1].collide(obsG2)){
            this.perdeuVida();
        }
        //checa se carro colidiu com outro carro
        if(cars[0].collide(cars[1])){
            this.perdeuVida();
        }
    }
    perdeuVida(){
        //checa se a vida é maior ou igual a 0
        if(player.life >= 0){
            //reduz a vida do jogador
            player.life -= 40;
            //checa se o carro está indo para a esquerda
            if(this.esquerda == true){
                //joga o carro para a direita
                player.posicaoX += 100;
            }else{ 
                //senão, joga o carro para a esquerda
                player.posicaoX -=100;
            }
            //escreve no banco de dados o novo valor
            player.update();
        }
    }


    coletarMoeda(i){
        cars[i-1].overlap(coins, function(coletor, collected){
            //aumenta a pontuação
            player.score += 10;
            //escreve o novo valor no banco de dados
            player.update();
            collected.remove();
        });
    }
    coletarComb(i){
        cars[i-1].overlap(fuels, function(coletor, collected){
            collected.remove();
            //devolve a quantidade de combustível do jogador
            player.fuel = 160;
        });
        //verifica se há combustível e se o player está se movendo
        if(player.fuel > 0 && this.movendo == true){
            //diminui a quantidade de combustível e atualiza no Banco de Dados
            player.fuel -=0.3;
            player.update();
        }
        //checa se a quantidade de combustível é menor 0
        if(player.fuel <= 0){
            //coloca o estado final para o jogo
            gameState = 2;
            //chama o método que colocará uma janela de fim de jogo
            this.gameOver();
        }
    }


    
    showFuel(){
        //atualizar as configurações
        push();
        //colocar a imagem do combustivel
        image (fuelImg, width/2 - 130, height - player.posicaoY - 100, 20, 20);
        //retângulo branco
        fill("white");
        rect(width/2 - 100, height - player.posicaoY - 100, 160, 20);
        //retângulo laranja
        fill("orange");
        rect(width/2 - 100, height - player.posicaoY - 100, player.fuel,20);
        //voltar para as configurações antigas
        pop();
    }

    showLife(){
        push();
        //coloca a imagem do coração
        image (lifeImg, width/2-130, height-player.posicaoY-150, 20, 20);
        //pinta de branco
        fill("white")
        //coloca um retângulo   
        rect(width/2 - 100,height - player.posicaoY - 150,160,20);
        //pinta de vermelho
        fill("red");
        //coloca um retângulo
        rect(width/2 - 100,height - player.posicaoY - 150,player.life, 20);
        pop();
    }



    play(){
        form.esconder();
        Player.getInfo();
        this.posicionar();
        //checar se allPlayers tem valor
        if(allPlayers !== undefined){
            player.pegarVencedores();
            this.mostrarPlacar();
            //colocar a imagem da pista
            image (pista, 0, -height*5 , width, height*6);
            //mostrar a barra de combustível
            this.showFuel();
            //mostrar a barra de vida
            this.showLife();
            //guardar o indice da sprite do carro
            var i = 0;
            //repetir os códigos pelo número de props do objeto
            for(var plr in allPlayers){
                //guarda do banco de dados o valor x
                var x = allPlayers[plr].posX;
                //guarda do banco de dados o valor y
                var y = height - allPlayers[plr].posY;


                //muda a posição da sprite do carro
                cars[i].position.x = x;
                cars[i].position.y = y;
                //aumenta o i para posicionar o outro carro
                i++;
                //checa se o valor de i é igual ao índice do jogador
                if( i == player.indice ){
                    if(player.life <= 0 ){
                        cars[i-1].changeImage("blast");
                        cars[i-1].scale = 0.4;
                        this.blast = true;
                    }
 
                    
                    
                    camera.position.y = y;
                    //detecta a colisão entre o carro e a moeda
                    this.coletarMoeda(i);
                    this.coletarComb(i);
                    //detecta a colisão do carro entre os obstáculos e o outro carro
                    this.colidiu(i);
                    linhaChegada = height * 6;
                    //checar se o player ultrapassou a linha de chegada
                    if(player.posicaoY > linhaChegada){
                        //aumentar o valor do rank do jogador
                        player.rank +=1;
                        //escrever esse novo valor no banco de dados
                        Player.atualizarVencedores(player.rank);
                        gameState = 2;
                        this.mostrarRank();
                    }

                }

            }
            //chamar o método controlar carro
            this.controlarCarro();
            //desenhar as sprites
            drawSprites();
        }
    }

    controlarCarro(){
        if(!this.blast){

        

            if(keyDown(UP_ARROW)){
                player.posicaoY += 10;
                player.update();
                this.movendo = true;
            }
            if(keyDown(LEFT_ARROW) && player.posicaoX > width*0.33){
                player.posicaoX -= 10;
                player.update();
                this.esquerda = true;
            }
            if(keyDown(RIGHT_ARROW) && player.posicaoX < width*0.66){
                player.posicaoX += 10;
                player.update();
                this.esquerda = false;
            }
        }
        
    }

    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }

    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state,
        })
    }
   
    gameOver(){
        swal({
            title: "Poxa!",
            text: "Você perdeu! :(",
            imageUrl:
            "https://www.pngplay.com/wp-content/uploads/6/Game-Over-Yellow-Transparent-PNG.png",
            imageSize: "120x120",
            confirmButtonText: "OK"
        });
    }

    mostrarRank() {
        swal({
          title: "Incrível!!! Merece um hambúrguer" +player.rank+ " º Lugar!",
          text: "Você alcançou a linha de chegada com sucesso!",
          imageUrl:
            "https://static.vecteezy.com/system/resources/previews/014/033/572/non_2x/hamburger-transparent-background-free-png.png",
          imageSize: "120x120",
          confirmButtonText: "Obrigado :)"
        });
      }

}

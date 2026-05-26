// Considerações:
// Houve uso da inteligência artificial para:
// 1. Criar a tela de gameover (function desenharTelaFinal)
// 2. Criar a hud de vida (funcition desenharVida)

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// sprites
const imgFundo = new Image();
imgFundo.src = "sprites/western_background.jpg"

const imgCacto = new Image();
imgCacto.src = "sprites/cactus.png"

const imgCowboy1 = new Image();
imgCowboy1.src = "sprites/cowboyvermelho.png"

const imgCowboy2 = new Image();
imgCowboy2.src = "sprites/cowboyazul.png"

    // background
    function desenharFundo() {
    ctx.drawImage(imgFundo, 0, 0, canvas.width, canvas.height);
    }


// finalizar o jogo
let gameover = false;

function verificarGameOver(){
    if(player1.vida <= 0){
        gameover = true;
        desenharTelaFinal("Azul Venceu!");
    }

    if(player2.vida <= 0){
        gameover = true;
        desenharTelaFinal("Vermelho Venceu!");
    }
}

function desenharTelaFinal(mensagem) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.54)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(mensagem, canvas.width / 2, canvas.height / 2);

    ctx.font = "25px Arial";
    ctx.fillText("Pressione F5 para jogar novamente", canvas.width / 2, canvas.height / 2 + 60);

    ctx.textAlign = "left";
}

function desenharTelaFinal(mensagem) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.54)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(mensagem, canvas.width / 2, canvas.height / 2);

    ctx.font = "25px Arial";
    ctx.fillText("Pressione F5 para jogar novamente", canvas.width / 2, canvas.height / 2 + 60);

    ctx.textAlign = "left";
}


// main (mudar fatores do jogo por aqui)

let player1 = {
    x: 900,
    y: 250,
    w: 120,
    h: 120,
    color: "red",
    speed: 5,
    vida: 4,
    cooldown: 600,
    ultimoTiro: 0
};

let player2 = {
    x: 50,
    y: 250,
    w: 120,
    h: 120,
    color: "blue",
    speed: 5,
    vida: 4,
    cooldown: 600,
    ultimoTiro: 0
};

let balas = [];
let teclas = {};
let cactos = [];

// cactos
function gerarCacto() {
    const margem = 150;
    const cW = 60;
    const cH = 60;
    const xMin = player2.x + player2.w + margem;
    const xMax = player1.x - cW - margem;

    if (xMin >= xMax) return;

    const x = Math.floor(Math.random() * (xMax - xMin) + xMin);
    const y = Math.floor(Math.random() * (canvas.height - cH - 80) + 80);

    cactos.push({ x, y, w: cW, h: cH });
}

setInterval(gerarCacto, 5000);

function desenharCactos() {
    ctx.fillStyle = "green";
    for (let c of cactos) {
        ctx.drawImage(imgCacto, c.x, c.y, c.w, c.h);
    }
}

// controle

document.addEventListener("keydown", function(evento){

    teclas[evento.key] = true;

    // Tiroteio
    // se mexer na segunda variavle de atirar muda a velocidade da bala
    if(evento.key == "ArrowLeft"){

        atirar(player1, -30);

    }

    if(evento.key == "d"){

        atirar(player2, 30);

    }

});

// precisa disso pra move não ficar eterna
document.addEventListener("keyup", function(evento){

    teclas[evento.key] = false;

});

// desenhar player

function desenharPlayer(player){
    let img;

    if (player === player1) {
        img = imgCowboy1;
    } else {
        img = imgCowboy2;
    }

    ctx.drawImage(img, player.x, player.y, player.w, player.h);

}

// desenhar bala

function desenharBalas(){

    for(let bala of balas){

        ctx.fillStyle = "black";

        ctx.fillRect(
            bala.x,
            bala.y,
            bala.w,
            bala.h
        );

    }

}

// movimentação

function moverPlayers(){
    if(teclas["ArrowUp"]){

        player1.y -= player1.speed;

    }

    if(teclas["ArrowDown"]){

        player1.y += player1.speed;

    }

    if(teclas["w"]){

        player2.y -= player2.speed;

    }

    if(teclas["s"]){

        player2.y += player2.speed;

    }

    limitarPlayer(player1);
    limitarPlayer(player2);

}

// teto e piso
function limitarPlayer(player){
    if(player.y < 80){

        player.y = 80;   

    }

    if(player.y + player.h > canvas.height){

        player.y = canvas.height - player.h;

    }

}

// atirar

function atirar(player, velocidade){
    let agora = Date.now();

// cooldown
    if(agora - player.ultimoTiro < player.cooldown){

        return;

    }

    player.ultimoTiro = agora;

    let bala = {

        x: player.x + player.w / 2,
        y: player.y + player.h / 2,

        w: 15,
        h: 5,

        velX: velocidade,

        dono: player

    };

    balas.push(bala);

}

// mover balas
function moverBalas(){

    for(let i = balas.length - 1; i >= 0; i--){

        let bala = balas[i];

        bala.x += bala.velX;

        // remove da tela
        if(bala.x < 0 || bala.x > canvas.width){

            balas.splice(i,1);
            continue;

        }

        // Dano em player
        if(
            bala.dono != player1 &&
            bala.x < player1.x + player1.w &&
            bala.x + bala.w > player1.x &&
            bala.y < player1.y + player1.h &&
            bala.y + bala.h > player1.y
        ){

            player1.vida--;

            balas.splice(i,1);

        }

        if(
            bala.dono != player2 &&
            bala.x < player2.x + player2.w &&
            bala.x + bala.w > player2.x &&
            bala.y < player2.y + player2.h &&
            bala.y + bala.h > player2.y
        ){

            player2.vida--;

            balas.splice(i,1);

        }

        // Colisão dos cactos
        let acertouCacto = false;
        for (let j = cactos.length - 1; j >= 0; j--) {
            if (
                bala.x < cactos[j].x + cactos[j].w &&
                bala.x + bala.w > cactos[j].x &&
                bala.y < cactos[j].y + cactos[j].h &&
                bala.y + bala.h > cactos[j].y
            ){
                cactos.splice(j, 1);
                balas.splice(i, 1);
                acertouCacto = true;
                break;
            }
        }
        if (acertouCacto) continue;
    }

}

// vida

function desenharVida(){

    // fundo 
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, 70);

    // azul
    ctx.fillStyle = "#4fc3f7";
    ctx.font = "bold 28px 'Courier New'";
    ctx.fillText("AZUL: " + player2.vida, 30, 45);

    // Vermelho
    ctx.fillStyle = "#ef9a9a";
    ctx.font = "bold 28px 'Courier New'";
    ctx.fillText("VERMELHO: " + player1.vida, 770, 45);

}

// jogo

function start(){
    if(gameover) return;

    desenharFundo();

    moverPlayers();
    moverBalas();
    verificarGameOver();

    desenharPlayer(player1);
    desenharPlayer(player2);
    desenharBalas();
    desenharVida();
    desenharCactos();

    requestAnimationFrame(start);

}

start();
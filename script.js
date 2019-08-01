
class Jogador{
    constructor(nome, simbolo){
        this.nome = nome;
        this.pontos = 0;
        this.vez = false;
        this.simbolo = simbolo;
        this.tuplas = []
    }
}

class JogoDaVelha {
    
    constructor(player1, player2){
        this.addClickAll();
        this.player1 = new Jogador(player1, 'X');
        this.player2 = new Jogador(player2, 'O');
        this.addPlayer(this.player1, 'play-1');
        this.addPlayer(this.player2, 'play-2');

        this.acabou = false;

        this.start();
    }

    start(){
        this.player1.vez = true;
        this.setMensagem(this.player1);
    }

    setMensagem(player){
        if (this.acabou){ return }
        var span_vez = document.querySelector('.vez span');
        var texto_vez;

        texto_vez = 'Turno de '+player.nome;
       
        span_vez.innerHTML = texto_vez;
    }

    setMensagemVencedor(player){
        var span_vez = document.querySelector('.vez span');
        var texto_vez;

        texto_vez = `Temos um Ganhador ${player.nome} !!`;
        span_vez.style.color = 'green';
        span_vez.innerHTML = texto_vez;
    }

    setMensagemVelha(){
        var span_vez = document.querySelector('.vez span');
        var texto_vez;

        texto_vez = `Deu Velha !!`;
        span_vez.style.color = 'red';
        span_vez.innerHTML = texto_vez;
    }

    setTurno(player){
        if (player == this.player1){ 
            this.setMensagem(this.player2);
            this.player1.vez = false;
            this.player2.vez = true;
        }else{
            this.setMensagem(this.player1);
            this.player2.vez = false;
            this.player1.vez = true;
        }    
    }

    addPlayer(player, id){
        var span_player = document.querySelectorAll('#'+id+' span');
        
        var texto_nome = document.createTextNode(player.nome);
        var texto_simbolo = document.createTextNode(player.simbolo); 

        span_player[0].appendChild(texto_nome);
        span_player[1].appendChild(texto_simbolo);
    }

    addClickAll(){
        var itens = document.querySelectorAll('.item');
        for (var i =0; i < itens.length; i ++){
            itens[i].setAttribute('onclick','jogo.clicado("'+ itens[i].id +'")');
        }
    }

    removeClickAll(){
        var itens = document.querySelectorAll('.item');
        for (var i =0; i < itens.length; i ++){
            itens[i].onclick = null;
        }
    }

    clicado(elemento){
        if (this.player1.vez){
            this.setSimbolo(elemento, this.player1);
            this.setTurno(this.player1);
        }else{
            this.setSimbolo(elemento, this.player2);
            this.setTurno(this.player2);
        }
    }

    setSimbolo(elemento, player){
        let item =  document.querySelector('#'+elemento);
        item.style.backgroundColor = 'black';
        item.onclick = null;

        let span =  document.querySelector('#'+elemento+" span");
        span.innerHTML = player.simbolo;

        var id = item.id;
        var vetor = id.split('-');
        
        var dic = {
            line: vetor[1],
            col: vetor[2]
        }

        player.tuplas.push(dic);

        this.getVencedor(player);
    }

    getVencedor(player){
        
        
        var linhas = {
            linha1 : [],
            linha2 : [],
            linha3 : []
        }

        var colunas = {
            col1 : [],
            col2 : [],
            col3 : []
        }

        var diagonais = {
            pricipal : [],
            secundaria :[]
        }


        for (let item of player.tuplas){
            if (item['line'] == '1'){
                linhas.linha1.push('1-'+item['col']);
            } else if (item['line'] == '2'){
                linhas.linha2.push('2-'+item['col']);
            } else if (item['line'] == '3'){
                linhas.linha3.push('3-'+item['col']);
            }

            if (item['col'] == '1'){
                colunas.col1.push(item['line']+'-1');
            } else if (item['col'] == '2'){
                colunas.col2.push(item['line']+'-2');
            } else if (item['col'] == '3'){
                colunas.col3.push(item['line']+'-3');
            }

            if (item['col'] == item['line'] ){
                diagonais.pricipal.push(item['line']+'-'+item['col']);
            }

            if (item['line'] == '1' && item['col'] == '3'){
                diagonais.secundaria.push('1-3');
            } else if (item['line'] == '3' && item['col'] == '1'){
                diagonais.secundaria.push('3-1');
            } else if (item['line'] == '2' && item['col'] == '2'){
                diagonais.secundaria.push('2-2');
            }
            
        }

        var vertor_ganhador = []

        if (linhas.linha1.length == 3){
            console.log(`Vencedor ${player.nome} na linhas 1`);
            vertor_ganhador = linhas.linha1;
        } else if (linhas.linha2.length == 3){
            console.log(`Vencedor ${player.nome} na linhas 2`);
            vertor_ganhador = linhas.linha2;
        } else if (linhas.linha3.length == 3){
            console.log(`Vencedor ${player.nome} na linhas 3`);
            vertor_ganhador = linhas.linha3;
        }

        if (colunas.col1.length == 3){
            console.log(`Vencedor ${player.nome} na coluna 1`);
            vertor_ganhador = colunas.col1;
        } else if (colunas.col2.length == 3){
            console.log(`Vencedor ${player.nome} na coluna 2`);
            vertor_ganhador = colunas.col2;
        } else if (colunas.col3.length == 3){
            console.log(`Vencedor ${player.nome} na coluna 3`);
            vertor_ganhador = colunas.col3;
        }

        if (diagonais.pricipal.length == 3){
            console.log(`Vencedor ${player.nome} na Diagonal Principal`);
            vertor_ganhador = diagonais.pricipal;
        } else if (diagonais.secundaria.length == 3){
            console.log(`Vencedor ${player.nome} na Diagonal Secundária`);
            vertor_ganhador = diagonais.secundaria;
        }

        player.pontos ++;

        vertor_ganhador.length > 0 ? this.setCoresVencedor(player, vertor_ganhador) : null;

        if (player.pontos >= 5 && !this.acabou){
            this.setMensagemVelha();
            this.addBotao()
            this.acabou = true;
        }


        
    }

    setCoresVencedor(player, lista){
        for (let id of lista){
            var item = document.querySelector('#div-'+id);
            item.style.backgroundColor = 'green';
        }

        console.log(player.nome);
        this.setMensagemVencedor(player);

        this.removeClickAll();
        this.acabou = true;

        this.addBotao();
    }

    addBotao(){
        var div = document.querySelector('.conteiner-btn');
        div.classList.add('btn');
        div.setAttribute('onclick','jogo.reiniciar()');
        var span = document.querySelector('.conteiner-btn span');   
        span.innerHTML = 'Reiniciar';
    }

    reiniciar(){
       location.reload();
    }
}


var jogo = new JogoDaVelha('Jogador 01', 'Jogador 02');






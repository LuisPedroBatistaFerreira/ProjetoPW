let tipoDeProdutos = ["Prato Principal", "Sobremesa", "Bebida", "Entrada"]


function Food(descricao, tipo, preco){
    if(typeof(tipo) != "string" || !tipoDeProdutos.includes(tipo)){
        console.error("Tem de estar incluido no tipo de produtos");
    }
    this.descricao = descricao;
    this.tipo = tipo;
    this.preco = preco;
    this.count = 0;
}
Food.prototype.toString=function(){
    return `Descrição : ${this.descricao} | Tipo : ${this.tipo} | Preço : ${this.preco}€`;
}
Food.prototype.getDescricao = function(){
    return this.descricao;
}
Food.prototype.getPreco = function(){
    return this.preco;
}
Food.prototype.getTipo = function(){
    return this.tipo;
}
Food.prototype.getCount = function(){
    return this.count;
}
Food.prototype.setCount = function(count){
    return this.count = count;
}
let bitoque = new Food("Bitoque","Prato Principal",10.0);
let bacalhauComNatas = new Food("Bacalhau Com Natas","Prato Principal",12.0);
let leiteDeCreme = new Food("Leite De Creme","Sobremesa",4.0);
let pao = new Food("Pão","Entrada",1.0);
let agua = new Food("Água","Bebida",0.8);


let produtos = [bitoque, bacalhauComNatas, leiteDeCreme, pao, agua];

function Order(numeroMesa){
    this.numeroMesa = numeroMesa;
    this.produtos = [];
}
Order.prototype.add = function(food){
    this.produtos.push(food);
    this.count++;
}
Order.prototype.remove = function(n, foodToRemove){
    for (let i = 0; i < n; i++) {
        let foodToRemoveNow = this.produtos.findIndex(product => product.getDescricao() === foodToRemove.getDescricao());
        this.produtos.splice(foodToRemoveNow,1);
    }
}
Order.prototype.getProduto = function(numero){
    return this.produtos[numero];
}
Order.prototype.getProdutos = function(numero){
    return this.produtos;
}

function Mesa(name){
    this.name = name
    this.order = null;
}

Mesa.prototype.getOrder = function(){
    return this.order;
}
Mesa.prototype.getName = function(){
    return this.name;
}
Mesa.prototype.setOrder = function(order){
    if(order == null){
        console.error("order must be valid");
        return;
    }
    this.order = order;
}

let mesas = []

let mesasLength = 0;

async function getmesas(){
    await fetch('/getMesas')
        .then(response => response.json())
        .then(listamesas => {
            mesasLength = 0;
            console.log(listamesas.length);
            for(let i = 0; i < listamesas.length; i++){
                let mesa = new Mesa(listamesas[i].id_mesa);
                mesa.setOrder(listamesas[i].id_mesa);
                mesas.push( mesa);
                mesasLength ++;
            }
        });
}
getmesas();
console.log(mesasLength);

let adicionarMesas = function(){
    let listaMesas = document.getElementById("listaMesas");
    for(let i = 0; i< mesasLength;i++){
        let elemento = document.createElement("li");
        let elementoButoon = document.createElement("button");
        elemento.id = "ElementoListaMesas" + (i + 1);
        elementoButoon.id = "ButaoMesa" + (i + 1);
        elementoButoon.textContent = "" + (i + 1);
        elementoButoon.tagName = "butaoMesa";
        elemento.appendChild(elementoButoon);
        listaMesas.appendChild(elemento);
    }
}

let adicionarProdutosaMesa = function () {
    let titulo = document.getElementById("tituloMesa");
    let tituloDividido = titulo.textContent.split(" ");
    let mesa = tituloDividido[1];
    let foodSelector = document.getElementById("selectFood");
    let food = produtos.find(product => product.descricao === foodSelector.value);
    console.log(food);
    let quantidadeNumber = document.getElementById("quantidade");
    let quantidade = quantidadeNumber.value;
    if(mesa != null){
        let order = mesas[mesa-1].getOrder();
        for(let i = 0; i<quantidade;i++){
            order.add(food);
        }
    }
    destroyList();
    createList(mesa);
}
let removerProdutosaMesa = function () {
    let titulo = document.getElementById("tituloMesa");
    let tituloDividido = titulo.textContent.split(" ");
    let mesa = tituloDividido[1];
    let foodSelector = document.getElementById("selectFood");
    let food = produtos.find(product => product.descricao === foodSelector.value);
    console.log(food);
    let quantidadeNumber = document.getElementById("quantidade");
    let quantidade = quantidadeNumber.value;
    if(mesa != null){
        let order = mesas[mesa-1].getOrder();
        order.remove(quantidade,food);
    }
    destroyList();
    createList(mesa);
    
}
let editarProdutosaMesa = function () {
    let titulo = document.getElementById("tituloMesa");
    let tituloDividido = titulo.textContent.split(" ");
    let mesa = tituloDividido[1];
    let foodSelector = document.getElementById("selectFood");
    let foodToEditar = produtos.find(product => product.descricao === foodSelector.value);

    
    let quantidadeNumber = document.getElementById("quantidade");
    let quantidade = quantidadeNumber.value;
    if(mesa != null){
        let order = mesas[mesa - 1].getOrder();
        let produtosVisitados = [];
        order.getProdutos().forEach(function (item) {
            let existingProductIndex = produtosVisitados.findIndex(product => product.descricao === item.descricao);
            if (existingProductIndex === -1) {
                
                produtosVisitados.push(item);
            } else {
                
                produtosVisitados[existingProductIndex].setCount(produtosVisitados[existingProductIndex].getCount() + 1);
            }
        });
        let foodQuantity = produtosVisitados.find(product => product.getDescricao() === foodToEditar.getDescricao()).getCount() + 1 ;
        console.log(foodQuantity);
        if(foodQuantity < quantidade){
            quantidade -= foodQuantity;
            console.log(quantidade);
            for(let i = 0; i< quantidade;i++){
                order.add(foodToEditar);
            }
        }
        if(foodQuantity > quantidade){
            foodQuantity -= quantidade;
            console.log(foodQuantity);
            order.remove(foodQuantity, foodToEditar);
        }
    }
    destroyList();
    createList(mesa);
    destroyList();
    createList(mesa);
}

let formParaEscolherProduto = function(tipo){
    let detalhesMesa = document.getElementById("detalhesMesa");
    let div = document.createElement("div");
    let titulo = document.createElement("h3");
    titulo.textContent = tipo + " Produtos:";
    let selectFood = document.createElement("select");
    selectFood.id = "selectFood"
    produtos.forEach(function(item) {
        let elemento = document.createElement("option");
        elemento.textContent = item.getDescricao();
        elemento.value = item.getDescricao();
        selectFood.appendChild(elemento);
    });
    let labelProduto = document.createElement("label");
    labelProduto.for = "selectFood";
    labelProduto.textContent = "Produto :";
    let quantidadeAAdicionar = document.createElement("input");
    quantidadeAAdicionar.type = "number";
    quantidadeAAdicionar.min = 0;
    quantidadeAAdicionar.id = "quantidade";
    let labelNumber = document.createElement("label");
    labelNumber.for = "quantidade";
    labelNumber.textContent = "Quantidade :";
    div.appendChild(titulo);
    div.appendChild(labelProduto);
    div.appendChild(selectFood);
    div.appendChild(labelNumber);
    div.appendChild(quantidadeAAdicionar);

    let guardar = document.createElement("button");
    guardar.textContent = "Guardar";

    if (tipo == "Adicionar"){
        guardar.addEventListener("click", adicionarProdutosaMesa);
    }
    if (tipo == "Remover"){
        guardar.addEventListener("click", removerProdutosaMesa);
    }
    if (tipo == "Editar"){
        guardar.addEventListener("click", editarProdutosaMesa);
    }
    div.appendChild(guardar);
    let cancelar = document.createElement("button");
    cancelar.textContent = "Cancelar";
    cancelar.addEventListener("click", function(){
        while(div.hasChildNodes){
            div.removeChild(div.firstChild);
        }
    });
    div.appendChild(cancelar);
    detalhesMesa.appendChild(div);
}

let adicionar = function(){
    formParaEscolherProduto("Adicionar");
}
let remove = function(){
    formParaEscolherProduto("Remover");
}
let editar = function(){
    formParaEscolherProduto("Editar");
}

function createList(mesaNumber) {
    let titulo = document.createElement("h2");
    titulo.id = "tituloMesa";
    titulo.textContent = "Mesa " + mesaNumber;
    let buttonAddProduto = document.createElement("button");
    
    let table = document.createElement("table");
    let tableHead = document.createElement("thead");
    let firstColuna = document.createElement("tr");
    let headProduto = document.createElement("th");
    let headQuantidade = document.createElement("th");
    let headValor = document.createElement("th");
    headProduto.textContent = "Produto";
    headQuantidade.textContent = "Quantidade";
    headValor.textContent = "Valor";
    firstColuna.appendChild(headProduto);
    firstColuna.appendChild(headQuantidade);
    firstColuna.appendChild(headValor);
    tableHead.appendChild(firstColuna);
    table.appendChild(tableHead);

    let order = mesas[mesaNumber - 1].getOrder();
    let produtosVisitados = [];
    order.getProdutos().forEach(function (item) {
        let existingProductIndex = produtosVisitados.findIndex(product => product.descricao === item.descricao);
        if (existingProductIndex === -1) {
            
            produtosVisitados.push(item);
        } else {
            
            produtosVisitados[existingProductIndex].setCount(produtosVisitados[existingProductIndex].getCount() + 1);
        }
    });
    Array.from(produtosVisitados).forEach(function(item) {
        let novaColuna = document.createElement("tr");
        let produto = document.createElement("th");
        let quantidade = document.createElement("th");
        let valor = document.createElement("th");
        produto.textContent = item.getDescricao();
        quantidade.textContent = item.getCount() + 1;
        valor.textContent = quantidade.textContent * item.getPreco() + "€";
        novaColuna.appendChild(produto);
        novaColuna.appendChild(quantidade);
        novaColuna.appendChild(valor);
        table.appendChild(novaColuna);
        item.setCount(0);

    });
    produtosVisitados = [];
    console.log(order.getProdutos());
    buttonAddProduto.addEventListener("click", adicionar);
    buttonAddProduto.textContent = "Adicionar";
    let buttonRemoveProduto = document.createElement("button");
    buttonRemoveProduto.textContent = "Remover";
    buttonRemoveProduto.addEventListener("click", remove);
    let buttonEditarProduto = document.createElement("button");
    buttonEditarProduto.textContent = "Editar";
    buttonEditarProduto.addEventListener("click", editar);
    let divParaLista = document.getElementById("detalhesMesa");
    divParaLista.appendChild(titulo);
    divParaLista.appendChild(table);
    divParaLista.appendChild(buttonAddProduto);
    divParaLista.appendChild(buttonRemoveProduto);
    divParaLista.appendChild(buttonEditarProduto);
}

function destroyList() {
    let divParaLista = document.getElementById("detalhesMesa");
    while (divParaLista.hasChildNodes()) {
        divParaLista.removeChild(divParaLista.firstChild);
    }
    colorTable();
}



function showOrderMesa() {
    mesasbutton = document.getElementsByTagName("button");
    Array.from(mesasbutton).forEach(function(item) {
        let count = 0;
        item.addEventListener("click", function(){
            if (count % 2 === 0) {
                let mesaNumber = item.textContent;
                createList(mesaNumber);
                item.style.backgroundColor = "brown";
            } else {
                destroyList();
                colorTable();
            }
            count++
        });
    });
}

function colorTable(){
    mesasbutton = document.getElementsByTagName("button");
    Array.from(mesasbutton).forEach(function(item) {
        console.log(mesas[item.textContent - 1].getOrder().getProdutos() );
        if(mesas[item.textContent - 1].getOrder().getProdutos().length != 0){
            item.style.backgroundColor = "orange";
        }else{
            item.style.backgroundColor = "white";
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    adicionarMesas();
    showOrderMesa();
});

"use strict"
const mysql = require("mysql2/promise");

const connectionOptions = {
    "host": "localhost",
    "user": "luisFerreira",
    "password": "luispedro2003",
    "database": "ProjetoPW"
}

async function execute(response,sqlCommand,values){
    let connection;
    try{
        connection = await mysql.createConnection(connectionOptions);
        let [rows, fields] = await connection.execute(sqlCommand, values);
        return rows;
    } catch(error){
        response.sendStatus(500);
    } finally{
        connection && connection.end();
    }
}

async function tiposDeProduto(request, response){
    let rows = await execute(response, "SELECT * FROM TiposDeProduto", []);
    response.render("tiposDeProduto", {
        tiposDeProduto : rows 
    }); 
};

async function addTipoDeProduto(request, response){
    let sameTipo = await execute(response, "SELECT * FROM TiposDeProduto WHERE tipoDeProduto LIKE ?",[request.body.tipoDeProduto]);
    if(sameTipo.length > 0){
        console.error("Tipo de produto já existe");
        return;			
    }
    if(request.body.tipoDeProduto){
        await execute(response, "INSERT INTO TiposDeProduto(tipoDeProduto) VALUES(?)",[request.body.tipoDeProduto]);
        response.redirect("/");
    } else{
        tiposDeProduto(request,response);        
    }        
}

async function removeTipoDeProduto(request, response){
    let id = Number(request.body.id);
    if(id){
        await execute(response, "DELETE FROM TiposDeProduto WHERE id_tipoDeProduto=?", [id]);
        response.redirect("/");
    }
    else{
        response.redirect("/");
    }
}

async function updateTipoDeProduto(request, response){
    let id = Number(request.body.id_update);
    let name = request.body.tipoDeProdutoUpdate;
    if(id && name){
        await execute(response, "UPDATE TiposDeProduto SET tipoDeProduto = ? WHERE id_tipoDeProduto = ?", [name,id]);
    }
    response.redirect("/");
}

async function produtos(request, response){
    let rows = await execute(response, "SELECT Produto.*, TiposDeProduto.tipoDeProduto FROM Produto JOIN TiposDeProduto ON Produto.id_tipoDeProduto = TiposDeProduto.id_tipoDeProduto;", []);
    let rowsForTipo = await execute(response, "SELECT * FROM TiposDeProduto", []);
    response.render("produtos", {
        produtos : rows, 
        tiposDeProduto : rowsForTipo
    }); 
};

async function addProduto(request, response){
    let nameProduto = request.body.produtoName;
    let preco = Number(request.body.produtoPreco);
    let id_tipoDeProduto = Number(request.body.tipoDeProdutoId);

    let sameProduto = await execute(response, "SELECT * FROM Produto WHERE produto LIKE ? AND id_tipoDeProduto = ?",[nameProduto, id_tipoDeProduto]);
    if(sameProduto.length > 0){
        console.error("Produto já existe");
        return;			
    }

    if(nameProduto && preco && id_tipoDeProduto){
        await execute(response, "INSERT INTO Produto(produto, preco,id_tipoDeProduto)  VALUES(?, ?, ?)",[nameProduto, preco, id_tipoDeProduto]);
        response.redirect("/produtos")
    }else{
        response.redirect("/produtos")
    }
}

async function removeProduto(request, response){
    let id = Number(request.body.idProduto);
    if(id){
        await execute(response, "DELETE FROM Produto WHERE id_produto=?", [id]);
    }
    response.redirect("/produtos");
}

async function updateProduto(request, response){
    let id = Number(request.body.idProduto);
    let name = request.body.nameProduto;
    let preco = Number(request.body.precoProduto);
    let tipoDeProduto = request.body.tipoDeProduto;
    if(id){
        if(name){
            await execute(response, "UPDATE Produto SET produto = ? WHERE id_produto=?", [name,id]);
        }
        if(preco){
            await execute(response, "UPDATE Produto SET preco = ? WHERE id_produto=?", [preco,id]);
        }
        if(tipoDeProduto){
            await execute(response, "UPDATE Produto SET id_tipoDeProduto = ? WHERE id_produto=?", [tipoDeProduto,id]);
        }
    }
    response.redirect("/produtos");
}

async function mesas(request, response){
    let rows = await execute(response, "SELECT * FROM Mesa", []);
    response.render("mesas", {
        mesas : rows 
    }); 
};

async function getMesas(request, response){
    let rows = await execute(response, "SELECT * FROM Mesa", []);
    response.json(rows);
};

async function orderMesa(request, response){
    let rows = await execute(response, "SELECT Produto.produto, Produto.preco, Orders.countParaProduto FROM Orders JOIN Produto ON Orders.id_produto = Produto.id_produto WHERE Orders.id_mesa = 1;",[]);
    response.json(rows);
}

module.exports.tiposDeProduto = tiposDeProduto; 
module.exports.produtos = produtos;
module.exports.mesas = mesas;
module.exports.addTipoDeProduto = addTipoDeProduto;
module.exports.removeTipoDeProduto = removeTipoDeProduto;
module.exports.updateTipoDeProduto = updateTipoDeProduto;
module.exports.addProduto = addProduto;
module.exports.removeProduto = removeProduto;
module.exports.updateProduto = updateProduto;
module.exports.orderMesa = orderMesa;
module.exports.getMesas = getMesas;

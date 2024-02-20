"use strict"
const requestHandlers = require("./scripts/request-handlers"); 
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded());
app.use(express.static("www"));
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", requestHandlers.tiposDeProduto);
app.post("/addTipoDeProduto", requestHandlers.addTipoDeProduto);
app.post("/removeTipoDeProduto", requestHandlers.removeTipoDeProduto);
app.post("/updateTipoDeProduto", requestHandlers.updateTipoDeProduto);
app.post("/addProduto", requestHandlers.addProduto);
app.post("/removeProduto", requestHandlers.removeProduto);
app.post("/updateProduto", requestHandlers.updateProduto);
app.get("/produtos", requestHandlers.produtos);
app.get("/mesas", requestHandlers.mesas);
app.get("/getMesas", requestHandlers.getMesas);
app.get("/order", requestHandlers.orderMesa);

app.listen(8081, function(){
    console.log("Server running at http://localhost:8081");
});

"use strict"

function deleteMessage(tipoDeProduto, path){
    path = path || "";
    if(tipoDeProduto){
        let form = document.forms[0];
        form.action += path + tipoDeProduto;
        form.submit();
    }
}

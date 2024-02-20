use ProjetoPW;

DROP TABLE IF EXISTS Produto;
DROP TABLE IF EXISTS TiposDeProduto;
CREATE TABLE TiposDeProduto (
	id_tipoDeProduto int primary key AUTO_increment,
    tipoDeProduto varchar(100)
);

INSERT INTO TiposDeProduto(tipoDeProduto) VALUES("Carne");
INSERT INTO TiposDeProduto(tipoDeProduto) VALUES("Peixe");
INSERT INTO TiposDeProduto(tipoDeProduto) VALUES("Sobremesa");
INSERT INTO TiposDeProduto(tipoDeProduto) VALUES("Entrada");


CREATE TABLE Produto (
	id_produto int primary key auto_increment,
    produto varchar(100) not null,
    preco float not null,
    id_tipoDeProduto int
);
ALTER TABLE Produto
ADD FOREIGN KEY (id_tipoDeProduto) REFERENCES TiposDeProduto(id_tipoDeProduto) ON DELETE CASCADE;

INSERT INTO Produto(produto, preco,id_tipoDeProduto)  VALUES("Bitoque", 10.0, 1);
INSERT INTO Produto(produto, preco,id_tipoDeProduto)  VALUES("Dourada", 12.0, 2);
INSERT INTO Produto(produto, preco,id_tipoDeProduto)  VALUES("Doce Da Casa", 5.5, 3);
INSERT INTO Produto(produto, preco,id_tipoDeProduto)  VALUES("Pão", 1, 4);

CREATE TABLE Mesa (
	id_mesa int primary key auto_increment,
    id_orders int
);

CREATE TABLE Orders (
	id_orders int primary key auto_increment,
    id_mesa int,
    id_produto int,
    countParaProduto int
);

ALTER TABLE Mesa
ADD FOREIGN KEY (id_orders) REFERENCES Orders(id_orders) ON DELETE SET NULL;

ALTER TABLE Orders
ADD FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE SET NULL;

ALTER TABLE Orders
ADD FOREIGN KEY (id_mesa) REFERENCES Mesa(id_mesa) ON DELETE CASCADE;
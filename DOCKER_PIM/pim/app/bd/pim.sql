DROP DATABASE IF EXISTS `pim`;

CREATE DATABASE pim; 

use pim;
--
-- Estructura de tabla para la tabla products
--

CREATE TABLE product (
  sku varchar(255) COLLATE latin1_bin NOT NULL,
  name varchar(255) COLLATE latin1_bin NOT NULL,
  price decimal(10,2) NOT NULL,
  short_description varchar(255) COLLATE latin1_bin NOT NULL,
  long_description text COLLATE latin1_bin NOT NULL,
  active tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (sku)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla images
--

CREATE TABLE image (
  id int(11) NOT NULL AUTO_INCREMENT,
  url text COLLATE latin1_bin,
  productSku varchar(255) COLLATE latin1_bin NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (productSku) REFERENCES product(sku) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla categories
--

CREATE TABLE category (
  id int(11) NOT NULL,
  name varchar(255) COLLATE latin1_bin NOT NULL,
  categoryParent int(11) NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (categoryParent) REFERENCES category (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla product_categories
--

CREATE TABLE product_category (
  id int(11) NOT NULL AUTO_INCREMENT,
  productSku varchar(255) COLLATE latin1_bin NOT NULL,
  categoryId int(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (productSku) REFERENCES product(sku) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Tabla para Reportes
--

CREATE TABLE historial (
  id int(11) NOT NULL AUTO_INCREMENT,
  periodo int(11) NOT NULL,
  tipo int(11) NOT NULL,
  PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

-- Insert de Datos
INSERT INTO `category`(`id`,`name`) VALUES (1, 'Varios');
INSERT INTO `category`(`id`,`name`, `categoryParent`) VALUES (2,'Ropa',1);
INSERT INTO `category`(`id`,`name`, `categoryParent`) VALUES (3,'Calzado',1);
INSERT INTO `category`(`id`,`name`, `categoryParent`) VALUES (4,'Maquillaje',1);

INSERT INTO `category`(`id`,`name`) VALUES (5, 'Computadoras');
INSERT INTO `category`(`id`,`name`, `categoryParent`) VALUES (6,'Portatiles',5);
INSERT INTO `category`(`id`,`name`, `categoryParent`) VALUES (7,'Desktop',5);
INSERT INTO `category`(`id`,`name`, `categoryParent`) VALUES (8,'Partes',5);

INSERT INTO `product`(`sku`, `name`, `price`, `short_description`, `long_description`, `active`) 
VALUES ('sku-1','Calcetines',3.5,'Para cubrir pies','Muy comodos y utiles para los pies',1);
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen1.com','sku-1');
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen2.com','sku-1');
INSERT INTO `product_category`(`productSku`, `categoryId`) VALUES ('sku-1', 2);

INSERT INTO `product`(`sku`, `name`, `price`, `short_description`, `long_description`, `active`) 
VALUES ('sku-2','Zapatos',300.0,'Excelente Calzado','Calzado muy fino y elegante',1);
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen1.com','sku-2');
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen2.com','sku-2');
INSERT INTO `product_category`(`productSku`, `categoryId`) VALUES ('sku-2', 3);

INSERT INTO `product`(`sku`, `name`, `price`, `short_description`, `long_description`, `active`) 
VALUES ('sku-3','Brillo Labial',10.0,'Sabor sandia.','No daña los labios...',1);
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen1.com','sku-3');
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen2.com','sku-3');
INSERT INTO `product_category`(`productSku`, `categoryId`) VALUES ('sku-3', 4);

INSERT INTO `product`(`sku`, `name`, `price`, `short_description`, `long_description`, `active`) 
VALUES ('sku-4','HP',5000.0,'super rapida.','Rapida, ligera y potente.',1);
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen1.com','sku-4');
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen2.com','sku-4');
INSERT INTO `product_category`(`productSku`, `categoryId`) VALUES ('sku-4', 6);

INSERT INTO `product`(`sku`, `name`, `price`, `short_description`, `long_description`, `active`) 
VALUES ('sku-5','DELL',6000.0,'super rapida.','rapida y potente.',1);
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen1.com','sku-5');
INSERT INTO `image`(`url`, `productSku`) VALUES ('http://imagen2.com','sku-5');
INSERT INTO `product_category`(`productSku`, `categoryId`) VALUES ('sku-5', 7);

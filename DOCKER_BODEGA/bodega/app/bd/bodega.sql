DROP DATABASE IF EXISTS bodega;

CREATE DATABASE bodega;

use bodega;

CREATE TABLE product (
  sku varchar(255) COLLATE latin1_bin NOT NULL,
  inventario int(5) NOT NULL,
  PRIMARY KEY (sku)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

CREATE TABLE reporteBodega (
  id int(11) NOT NULL AUTO_INCREMENT,
  tipo int(11),
  periodo int(5),
  tienda VARCHAR(255),
  ubicacion VARCHAR(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

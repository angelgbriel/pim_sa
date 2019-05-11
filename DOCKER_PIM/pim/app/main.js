var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
const config = require('config');
var getlorem = require('getlorem');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var periodo = 1;
var idCategoria = 8;
var tipos = {
	producto: 1,
	catalogo: 2,
	enriquecer: 3
};

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pim'
});

app.get('/', (req, res)=>{
	connection.query('SELECT * FROM `product` WHERE 1', function(error, results, fields){
		if (error) throw error;
		//console.log(results.length);
		console.log('RESULTADO: ', results[0]);
	});	
	res.send('PIM');
});

app.get('/PIM/obtenerCatalogo', (req, res)=>{
	var categorias = [];
	var productos = [];
	var sql = "SELECT * FROM `category` WHERE categoryParent is null";
	connection.query(sql,[], function(error, results, fields){
		results.forEach((categoria)=>{
			categorias.push({id: categoria.id, nombre: categoria.name, padre: categoria.categoryParent});
		});
		sql = "SELECT * FROM `category` WHERE categoryParent is not null";
		connection.query(sql,[], function(error, results, fields){
			results.forEach((categoria)=>{
				categorias.push({id: categoria.id, nombre: categoria.name, padre: categoria.categoryParent});
			});
			sql = "SELECT p.sku, p.name, p.price, p.short_description, p.long_description, p.active, ca.id FROM product as p, category as ca, product_category as pc WHERE pc.productSku = p.sku and pc.categoryId = ca.id";
			connection.query(sql, [], function(error, results, fields){
				results.forEach((producto)=>{
					productos.push({
						sku: producto.sku,
						nombre: producto.name,
						categorias: [producto.id],
						activo: (producto.active == 1)? true : false,
					});
				});
				var resultado = {
					categorias: categorias,
					productos: productos
				};
				sql = "INSERT INTO `historial`(`periodo`,`tipo`) VALUES (?,?)";
				connection.query(sql, [periodo, tipos.catalogo], function(error, results, fields){
					var resultado = {
						categorias: categorias,
						productos: productos
					};
					res.json(resultado);
				});
			});
		});
	});
});

app.get('/PIM/enriquecerProducto', (req, res)=>{	
	var sql = "";
	var productos = [];
	var cantidad = req.body.arreglo.length;
	req.body.arreglo.forEach((sku)=>{
		sql = "SELECT p.sku, p.name, p.price, p.short_description, p.long_description, p.active, ca.id, i.url FROM product as p, category as ca, product_category as pc, image as i WHERE pc.productSku = p.sku and pc.categoryId = ca.id and i.productSku = p.sku and p.sku = '"+sku+"';";		
		connection.query(sql, function(err, result){
			var tam = result.length;
			var producto = {
				sku: result[0].sku,
				nombre: result[0].name,
				precio_lista: result[0].price,
				descripcion_corta: result[0].short_description,
				descripcion_larga: result[0].long_description,
				imagenes:[],
				categorias:[result[0].id],
				activo: result[0].active
			};
			result.forEach((proc)=>{
				producto.imagenes.push(proc.url);
			});
			productos.push(producto);
			cantidad--;
			if(cantidad==0){
				sql = "INSERT INTO `historial`(`periodo`,`tipo`) VALUES (?,?)";
				connection.query(sql, [periodo, tipos.enriquecer], function(err, result){
					console.log('enviado enrequiesimiento');
					res.json(productos);
				});
			}
		});
	});	
});

app.get('/periodo', /*async*/(req, res)=>{
	periodo++;
	var procs = getlorem.words(5);
	procs = procs.replace('.','').replace(',','');
	var vecProc = procs.split(' ');
	
	var cats = getlorem.words(2);
	cats = cats.replace('.', '').replace(',','');
	var vecCats = cats.split(' ');

	var indexC = 1;
	var indexP = 1;
	var sql = "";
	var catIndex = [];
	console.log('acomensar, indiceCat en: '+indexC);
	vecCats.forEach((categoria)=>{
		sql = "INSERT INTO `category`(`id`,`name`) VALUES (?,?)";
		idCategoria++;
		connection.query(sql, [idCategoria,categoria], function(error, results){
			catIndex.push(idCategoria);
			console.log('idCategori actual: '+idCategoria);
			console.log('Indece: '+indexC+', tam vec: '+vecCats.length);
			if(indexC == vecCats.length){
				console.log('Entro a generar productos');
				vecProc.forEach((producto)=>{
					sql = "INSERT INTO `product`(`sku`, `name`, `price`, `short_description`, `long_description`) VALUES (?,?,?,?,?)";
					var datos = [
						producto+'-'+Date.now(),
						producto,
						(Math.random() * (500.99 - 5.00) + 5.00).toFixed(2),
						getlorem.sentences(1),
						getlorem.sentences(5)
					];
					console.log('crear producto index: '+indexP+', tamvec: '+vecProc.length);
					connection.query(sql, datos, function(error, results){
						sql = "INSERT INTO `product_category`(`productSku`, `categoryId`) VALUES (?,?)";
						connection.query(sql, [datos[0], 5], function(error, results){
							sql = "INSERT INTO `image`(`url`, `productSku`) VALUES (?,?)";
							connection.query(sql, ['http://'+getlorem.words(1)+'com',datos[0]], function(error, results){
								if(indexP == vecProc.length){
									sql = "INSERT INTO `historial`(`periodo`,`tipo`) VALUES (?,?)";
									connection.query(sql, [periodo, tipos.producto], function(error, results){
										console.log('Fin de registro de nuevos productos, cambio de periodo');
										res.send('Cambio de periodo realizado xD');
									});
								}
								indexP++;
							});
						});
					});
				});
			}
			indexC++;
		});
	});
});

app.get('/baja', (req, res)=>{
	var sql = "select sku,active from product where active = 1 limit 2";
	connection.query(sql,[],function(error, results, fields){
		if(results.length == 2){
			sql = `update product set active = 0 where sku in ('${results[0].sku}','${results[1].sku}')`;
			console.log('Query: '+sql);
			connection.query(sql,[], function(error, results, fields){
				console.log('productos dados de baja');
				res.send('Productos datos de baja');
			});
		} else{
			console.log('no se obtubieron 2 productos para dar de baja');
			res.send('no se obtubieron 2 productos para dar de baja');
		}
	});
});

app.get('/rep/periodo', (req, res)=>{
	var sql = "SELECT COUNT(periodo) AS total ,tipo, periodo FROM historial group by tipo,periodo order by tipo";
	connection.query(sql, [], function(error, results, fields){
		var salida = [];
		var contador = 0;
		var cantidad = 5;
		results.forEach((elemento)=>{
			if(elemento.tipo == tipos.producto){
				salida.push({periodo: elemento.periodo, accion:'5 productos nuevos'});
				cantidad = cantidad + 5;
			} else if(elemento.tipo == tipos.catalogo){
				salida.push({periodo: elemento.periodo, accion:`Consultas al catalogo ${elemento.total}`});
			} else if(elemento.tipo == tipos.enriquecer){
				salida.push({periodo: elemento.periodo, accion:`Consultas a Enriquecer Productos ${elemento.total}`});
			}
			contador++;
			if(contador == results.length){
				salida.push({totalProductos: cantidad});
				res.json(salida);
			}
		});
	});
});

app.listen(8080, function(){
	connection.connect();
	console.log('Corriendo en puerto 8080');
});

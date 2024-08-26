/* Server para Katana "Nombre opcional"  */
//-----* Express inicia servidor / carpeta raiz
// Codigo para el server 
const { ifError } = require('assert');
const express = require('express');
const app = express();
let clientesConectados = []
app.use(express.static(__dirname))
const server = app.listen(4444, () => {
    console.log('server activated !')
})
var fs = require('fs');
var fss = require('fs');

//-------------------------------------------------------------------- Postgres module object -----------------------------------------//
const { Pool } = require('pg')
pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'ialab',
    database: 'katana',
})
let client


/********************************************************** Conexiones Socket */
var io = require('socket.io')(server); //Bind socket.io to our express server.


io.on('connection', (socket) => {//Un Socket para todos los requerimientos a postgres


    socket.on('openclient', async function () { // conexion con main_script
        await openconnection()
        console.log("Client on...")
    });
    socket.on('closeclient', async function () { // conexion con main_script
        await closeconnection()
    });
    socket.on('experiment', async function () { // conexion con main_script
        await experiment()
        console.log("this is experiment... ")
    })
    socket.on('socketconection', async function (serial, status, day, fecha, semana, turno, P1011, P1012, P2011, P2012, P3011, P3012, localTimeString) { // conexion con main_script
        await inserta(serial, status, day, fecha, semana, turno, P1011, P1012, P2011, P2012, P3011, P3012, localTimeString)
        console.log("this is inserta... ")
    })
    socket.on('agrupardias', async function (statust, day, semana) {
        agrupardias(statust, day, semana)
        // console.log("entre a agrupar dias")
    });
    socket.on('countas', async function (P1011, P1012, P2011, P2012, P3011, P3012, day, semana) {
        countas(P1011, P1012, P2011, P2012, P3011, P3012, day, semana)
        //console.log("estoy en la funcion countas del backend")
    });

    socket.on('plckatana', async function (p) { // comunicacion con la funcion de javascript
        plc(p);
    });

    socket.on('plc_response', function (responsevalue) {
        plcdatasender2(responsevalue)
        console.log(responsevalue)
    });

    socket.on('picsaving', async function (dataURI, valor, p, status) { // se le mandan los parametros no importa si no tienen los mismos nombres
        await savingpic(dataURI, valor, p, status); //espera la funcion savingpic con los parametros 
        //console.log("recibe", snfile);
    });

    socket.on('picsaving2', async function (dataURI, serial, sqty) { // se le mandan los parametros no importa si no tienen los mismos nombres
        await savingpic2(dataURI, serial, sqty); //espera la funcion savingpic con los parametros 
        //console.log("recibe", serial);
    });

    socket.on('renombrasnr', function (serial) { // conexion con main_script
        renombraF(serial);
    });
    socket.on('logsaving', function (logarray, serial) { // conexion con main_script
        savinglog(logarray, serial);
    });
});//Close io.on

//---------------------------------------------------------------- Funciones para abrir conexion con el cliente pg ---------------------------------------------------------//
async function openconnection() {
    client = await pool.connect()
}
async function closeconnection() {
    return new Promise(async resolve => {
        client.end()
        client.release()
        resolve('resolved')
    })
}

//Funcion imprime cuantos clientes estan conectados en la base de datos 
async function experiment() {
    console.log("total", pool.totalCount)
    console.log("idle", pool.idleCount)
    console.log("clientes esperando", pool.waitingCount)
}

//---------------------------------- QUERYS ---------------------------------------------------------------//
//-----------------------------------Funcion inserta  -----------------------------------------------------//
async function inserta(serial, status, day, fecha, semana, turno, P1011, P1012, P2011, P2012, P3011, P3012, localTimeString) {
    // return new Promise(async resolve => {
    console.log(serial, status, day, fecha, semana, turno, P1011, P1012, P2011, P2012, P3011, P3012, localTimeString)
    let pg = "INSERT INTO unidades VALUES ('" + serial + "','" + status + "', '" + day + "','" + fecha + "'," + semana + ",'" + turno + "','" + P1011 + "','" + P1012 + "','" + P2011 + "','" + P2012 + "','" + P3011 + "','" + P3012 + "','" + localTimeString + "')"

    client.query(pg, (err, result) => {
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
}

//---- Funcion extraccion --//
async function agrupardias(status, day, semana) {
    console.log("estoy en funcion agrupadias")
    let upf = "SELECT COUNT (*) FROM unidades WHERE status = ('" + status + "') AND day = ('" + day + "') AND semana = ('" + semana + "') ";
    client
        .query(upf)
        .then((result) => { io.emit('qtyD', { result, status, day, semana }); })
        .catch((err) => console.error('Error executing query', err.stack))
}

//--------------------------------- Funcion conteo -------------------------------------------------------//

async function countas(P1011, P1012, P2011, P2012, P3011, P3012, day, semana) { //"SELECT COUNT (*) FROM ubicaciones WHERE ta1 = ('" + ta1 + "') AND day = ('" + day + "') AND semana = ('" + semana + "')"//OR ta2 = ('"+ ta2 +"')"; //AND day = ('" + day + "')  AND semana =("+semana+") 
    console.log("entre a countas", P1011, P1012, P2011, P2012, P3011, P3012, day, semana)
    let tas =
        "SELECT COUNT (*) AS conteototal, SUM(CASE WHEN p1011 = ('" + P1011 + "') AND semana = ('" + semana + "') THEN 1 ELSE 0 END) AS Conteop1011, SUM(CASE WHEN p1012=('" + P1012 + "') AND semana = ('" + semana + "') THEN 1 ELSE 0 END) AS Conteop1012,SUM(CASE WHEN p2011=('" + P2011 + "') AND semana = ('" + semana + "') THEN 1 ELSE 0 END)AS Conteop2011,SUM(CASE WHEN p2012=('" + P2012 + "') AND semana = ('" + semana + "') THEN 1 ELSE 0 END) AS Conteop2012,SUM(CASE WHEN p3011=('" + P3011 + "') AND semana=('" + semana + "') THEN 1 ELSE 0 END) AS Conteop3011,SUM(CASE WHEN p3012=('" + P3012 + "') AND semana=('" + semana + "') THEN 1 ELSE 0 END)AS Conteop3012 FROM unidades WHERE p1011= ('" + P1011 + "') OR p1012=('" + P1012 + "') OR p2011=('" + P2011 + "') OR p2012=('" + P2012 + "') OR p3011=('" + P3011 + "') OR p3012=('" + P3012 + "') "
    //console.log(tas)
    client
        .query(tas)
        .then((result) => { io.emit('qtytas', { result, P1011, P1012, P2011, P2012, P3011, P3012, day, semana }); })
        .catch((err) => console.error('Error executing query', err.stack))
}


//--------------------------------- Funcion para buscar existencias --------------------------------------//
async function existe(estacion, componente, defecto) {
    return new Promise(async resolve => {
        console.log("Entre a consulta exist :) ")

        //let pg = "SELECT COUNT (*) FROM unidades WHERE estacion = ('"+estacion+"')"
        let pugy = "SELECT EXISTS (SELECT 1 FROM unidades WHERE estacion = ('" + estacion + "') AND componente = ('" + componente + "') AND defecto = ('" + defecto + "') )";
        //let pg = "SELECT estacion,componente,defecto FROM unidades WHERE EXISTS(SELECT * FROM unidades WHERE estacion = ('"+estacion+"') AND componente = ('"+componente+"') AND defecto = ('"+defecto+"') )"
        //let pg = "SELECT * FROM unidades WHERE EXISTS (SELECT 1 FROM unidades WHERE estacion = ('"+estacion+"') AND componente = ('"+componente+"') AND defecto = ('"+defecto+"') )"
        console.log("Query: " + pugy)
        client
            .query(pugy)
            .then((result) => { io.emit('bdresponse', { result, estacion, componente, defecto }); console.log(result) }) // brianc
            .catch((err) => console.error('Error executing query', err.stack))
        resolve('resolved');
    })
}



//************************************************************** TCP/IP  **************************************/
let plc_endresponse = 0
var net = require('net');

var tcpipserver = net.createServer(function (connection) {
    console.log('TCP client connected');
    //connection.on('end', function() {
    //console.log(Buffer.toString());  
    //});
    connection.write('Handshake ok!\r\n');
    //connection.pipe(connection);
    clientesConectados.push(connection)
    //Funcion para imprimir la cadena que le envianconsole.log(data)
    //connection.on('data', function(data) { console.log(data.toString())});
    connection.on('data', function (data) { io.emit('Sequence_start', data.toString()); console.log(data.toString()); })
    /*.on('error', (err)=>{
        console.log("cadena",data.toString())
        //client.end()
        })*/

    //Inicia la secuencia

    //Responde a PLC cuando termine inspeccion


})


function plcdatasender2(responsevalue) {
    matrixtostring = responsevalue.toString()
    plc_endresponse = matrixtostring
    console.log("Cadena Nueva: ", responsevalue)
    clientesConectados.forEach((socket) => {
        estadoconexion = socket.readyState
        console.log("Comunicacion con el plc :" + socket.readyState)

        if (estadoconexion == 'closed') {
            console.log("Puerto de PLC cerrado reintento en 1min...")
        }
        if (estadoconexion == 'open') {

            socket.write(plc_endresponse)
        }
    })
}
tcpipserver.listen(40000, function () {
    console.log('PLC Port 40000 listening...');
})


/*
let clientesConectados = [];
let plc_endresponse = 0
io.on('connection', (socket) => {

    socket.on('plc_response', function (result_matrix) {
        plcdatasender2(result_matrix)
        //console.log(result_matrix)
    })
})

var net = require('net')
var tcpipserver = net.createServer(function (connection) {
 try {  
    console.log('TCP client connected')
    connection.write('Handshake ok!\r\n')
    clientesConectados.push(connection);

    connection.on('data', function (data) { 
        console.log('Datos recibidos de PLC',  data.toString())
        io.emit('Timsequence_start', data.toString()); 
        console.log("Analisis in process...") })

//Responde a PLC cuando termine inspeccion
// Implementación de keep-alive
connection.on('timeout', function () {
    console.log('Keep-alive: Reenviando paquete de ping...');
    connection.write('Ping\r\n');
  });

connection.on('close', function () {
    console.log('Keep-alive: Conexión cerrada. Reintentando...');
    // Reintentar la conexión
  });

} catch (e){
    console.error(e.name + ": " + e.message)
    console.log("PLC NO RESPONDE EN TIEMPO A LA RESPUESTA DE PRUEBA...")
}
})

function plcdatasender2(result_matrix) {
    clientesConectados.forEach(socket=>{
    matrixtostring = result_matrix.toString()
    plc_endresponse = matrixtostring
    console.log("Cadena enviada a PLC",matrixtostring)
    try {
        estadoconexion = socket.readyState
        console.log("Comunicacion con el plc :" + socket.readyState)
        if (estadoconexion == 'closed') {
            console.log("Puerto de PLC cerrado")
        }
        if (estadoconexion == 'open') {
            socket.write(plc_endresponse)
        }
        } catch (e){
        console.error(e.name + ": " + e.message)
        console.log("PLC NO RESPONDE")
        }
    })
    
}

tcpipserver.listen(40000, function () {
    console.log('PLC Port 40000 listening...')
})
*/


async function savingpic(dataURI, valor, p, status) {

    let filePath;
    const ImageDataURI = require('image-data-uri');
    return new Promise(async resolve => {
        if (p == 0) {
            if (status == 1) {
                filePath = './pruebas/' + 'pass';
            }
            else {
                filePath = './pruebas/' + 'fail';
            }
        }
        else if (p == 2) {
                if (status == 1) {
                    filePath = './pruebas/pruebas_2/' + 'pass';
                }
                else {
                    filePath = './pruebas/pruebas_2/' + 'fail';
                }
            }
        else if (p == 3) {
                if (status == 1) {
                    filePath = './pruebas/pruebas_3/' + 'pass';
                }
                else {
                    filePath = './pruebas/pruebas_3/' + 'fail';
                }
            }
            //Ruta de las carpetas por seria

        else {
            filePath = './pruebas/' + 2;//Ruta de las carpetas por serial
        }
        let filevalidation = fss.existsSync(filePath);
        if (filevalidation) {
            filePath = '' + filePath + '/' + valor + '';

            ImageDataURI.outputFile(dataURI, filePath).then(res => console.log(res));
        }
        else {
            fss.mkdir(filePath, (error) => {
                if (error) {
                    console.log(error.message);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
                }
                filePath = '' + filePath + '/' + valor + '';
                ImageDataURI.outputFile(dataURI, filePath).then(res => console.log(res));
            });
        }
    });//Cierra Promise
}

/*********************************************************** Guardao de imagenes */
//Guardado de imagenes carpeta Katana_Samples
async function savingpic2(datauri, serial, sqty) {
    let filePath;
    const ImageDataURI = require('image-data-uri');
    return new Promise(async resolve => {
        //console.log("Variables:"+serial+' - '+sqty+'');// temporal para ver que esta rebiendo 

        //C:/Users/mayra_ayala/Documents/AOI_TESLA/img/
        
        //C:/Users/gdl3_mds/myapp/timsamples/

        let filePath = 'C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial + '';//Ruta de las carpetas por serial
        let filevalidation = fs.existsSync(filePath);

        if (filevalidation) {

            filePath = '' + filePath + '/' + sqty + '';
            ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));

        }
        else {
            fs.mkdir(filePath, (error) => {
                if (error) {
                    console.log(error.message);//en caso de que el folder ya exista manda un error y evita hacer otro folder con el mismo nombre.
                }
                filePath = '' + filePath + '/' + sqty + '';
                ImageDataURI.outputFile(datauri, filePath).then(res => console.log(res));
                console.log("Directorio creado");
            });
        }

    });//Cierra Promise

}

async function renombraF(serial) {
    fs.rename('C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial,
        'C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial + '_F',
        function (err) {
            if (err)
                console.log('Error de renombramiento');
        });
}


async function savinglog(logarray, serial) {
    let logpath = 'C:/Users/gdl3_mds/Documents/katana/katana_samples/' + serial + '/log.txt';
    fs.writeFile(logpath, logarray, function (err) {
        if (err) throw err;
    });
}

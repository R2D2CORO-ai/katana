/* Proyecto Katana js  */

/*linea para git */
let statusx
let statusArry
let boxpoint = []
let boxpointcalis = []
let arryboth = []
let desicion = []
let pointsArray = []
let logarray = []
let cadenadedatos
let pointsAll
let coord1 = []
let coord2 = []
let coord3 = []
let tasArry = []
let bladeA = []
let bladeB = []
let bladeC = []
let pass1 
let fail0 
let serial
let resultado
let fullimage = document.getElementById('CanvasFHD')
let fullimagectx = fullimage.getContext('2d')
let statusf
let P3011
let P3012
let P2011
let P2012
let P1011
let P1012
let p1011fail
let p1012fail
let p2011fail
let p2012fail
let p3011fail
let p3012fail
let blade1
let blade2
let blade3
let blade4
let blade5
let blade6
let turno_pass_qtyD
let recortito = document.getElementById('Canvascut')
let recortitoctx = recortito.getContext('2d')
let recortito1 = document.getElementById('Canvascut1')
let recortitoctx1 = recortito1.getContext('2d')
let recortito2 = document.getElementById('Canvascut2')
let recortitoctx2 = recortito2.getContext('2d')
let recortito3 = document.getElementById('Canvascut3')
let recortitoctx3 = recortito3.getContext('2d')
let recortito4 = document.getElementById('Canvascut4')
let recortitoctx4 = recortito4.getContext('2d')
let recortito5 = document.getElementById('Canvascut5')
let recortitoctx5 = recortito5.getContext('2d')
const video = document.querySelector('video')
let capturap30 = document.getElementById('imagen_p30')
let capturap30tcx = capturap30.getContext('2d')

let capturap20 = document.getElementById('imagen_p20')
let capturap20tcx = capturap20.getContext('2d')

let capturap10 = document.getElementById('imagen_p10')
let capturap10tcx = capturap10.getContext('2d')

let model = new cvstfjs.ObjectDetectionModel()

let model1 = new cvstfjs.ClassificationModel();
let model2 = new cvstfjs.ClassificationModel();
let model3 = new cvstfjs.ClassificationModel();

//--------------------------------------- datos fecha ------------------------//
 //------------------------------- Muestra la hora local --------------------------------//
const d= new Date();
let hora = d.getHours(); //da el numero de la hora local ejemplo = 12, 13, 14
let now = new Date();

// Get the local time string formatted according to the browser's locale
let localTimeString = now.toLocaleTimeString();

// Display the local time
console.log(localTimeString); // Output: 11:04:29 AM/PM (assuming current time is 11:04:29 AM/PM)

//------------------------------- Muestra dia de calendario -----------------------------//
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const dia = new Date();
let day = weekday[dia.getDay()];

//------------------------------- Muestra dia del mes en calendario -----------------------------//
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const m = new Date();
let month = months[m.getMonth()];

//------------------------------- Muestra el año  -----------------------------//
const numero = new Date()
let num = numero.getDate()

const año = new Date()
let anio = año.getFullYear()

const numdia = new Date()
let dias = numdia.getDay()

let fecha = anio+"-"+month+"-"+num
console.log(fecha)

function getweek(date){
    var onejan = new Date (date.getFullYear(),0,1)
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7)
}
//------------------------------ Muestra numero de semana ----------------------//
var date = new Date(fecha);
let semana = getweek(date);
console.log('Semana:',semana);

const fechaActual = new Date()
const diaSemana = fechaActual.getDay()

//******************************* Carga Funciones al refrescar la pagina */
window.onload = async function(){
    return new Promise(async resolve => {
        //divhidden()
       /* const socket = io();
        socket.emit('AlldataBD')*/
        await gopen()
        //await deshabilitar()
        await numsem()
    resolve('resolved')})}

//----------------------------------- Funcion de secuencia (solo si se requiere)-------------//
async function startsequence(){
    await inserta(contenido)
    //await goclose()
}


/*************************************************************************************** Cargar modelos */
//Cargar modelo al iniciar la pagina 
async function loadmodel() {
//----Segmentacion
    await model.loadModelAsync('./Entrenamiento-Segmentacion/segmentacion1/model.json') //C:\Users\gdl3_mds\Documents\katana\modelm\New folder
    console.log(model)

//----Clasificacion
    await model1.loadModelAsync('./Entrenamientos-Clasificacion/clasificacion1/model.json'); //punto 1,2
    console.log(model1)
    
    await model2.loadModelAsync('./Entrenamientos-Clasificacion/clasificacion2/model.json'); //punto 3,4
    console.log(model2)

    await model3.loadModelAsync('./Entrenamientos-Clasificacion/clasificacion3/model.json'); //punto 5,6
    console.log(model3)

}
loadmodel()


//************************************************************************************** Imagenes de prueba para la funcion loadcapturas*/
let image = new Image()
image.src = "/img/p30.png"

let image2 = new Image()
image2.src = "/img/Camara/img_old/1.jpg"

let image3 = new Image()
image3.src = "/img/p20.png"

//*************************Socket block */
const socket = io();

//*********************************** Datos recibidos de back-end  */
socket.on('Sequence_start', function (infoplc) {
    if (infoplc != 0) {
        cadenadedatos = infoplc.toString()
        serial = infoplc.toString().substr(14,15)
        console.log(serial)
        Sequence()//Activa bandera para continuar
        console.log("Start test sequence");
    }
    else {
        console.log("Algo salio mal en el backend");
    } boxpoint
});

//------------------------------------funciones para conexiones de cliente a BD ---------//

async function goclose(){
    return new Promise(async resolve =>{
    const socket = io();
    socket.emit('closeclient') 
    resolve('resolved')})
}
function experiment(){
    const socket = io();
    socket.emit('experiment') 
}
async function gopen(){
    return new Promise(async resolve =>{
    const socket = io();
    socket.emit('openclient') 
    setTimeout(function fire() { resolve('resolved'); }, 1000)})
}
let seri = "texto calis"
//----------------------------------- Funciones para insertar datos -----------------------//
async function insert(seri){
    return new Promise(async resolve =>{
        const socket = io();
        socket.emit('insert',seri)
    
    resolve('resolved')})    
}



function plc_response(boxpoint,boxpointcalis,resultadofinal) { //El Array boxpoint guarda la equivalencia del punto, cuando vale pass o cuando vale fail
    return new Promise(async resolve => {
        logarray = 
        "\n"+
        "Espada 1" + " = " + boxpoint[1] + " --> " + `${boxpoint[1] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 2" + " = " + boxpoint[2] + " --> " + `${boxpoint[2] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 3" + " = " + boxpoint[3] + " --> " + `${boxpoint[3] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 4" + " = " + boxpoint[4] + " --> " + `${boxpoint[4] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 5" + " = " + boxpoint[5] + " --> " + `${boxpoint[5] == 0 ? 'Fail' :'Pass'}` + "\n" +
        "Espada 6" + " = " + boxpoint[6] + " --> " + `${boxpoint[6] == 0 ? 'Fail' :'Pass'}` + "\n" + ""
        
        boxpointcalis =
        "&" + (pass1 == 1 ? 1 : 0)+ "&" + 
         arryboth[1] + "$" + "NA" + "&" + blade1 + "&" + "P1011" + "&" +
         arryboth[2] + "$" + "NA" + "&" + blade2 + "&" + "P1012" + "&" +
         arryboth[3] + "$" + "NA" + "&" + blade3 + "&" + "P2011" + "&" +
         arryboth[4] + "$" + "NA" + "&" + blade4 + "&" + "P2012" + "&" +
         arryboth[5] + "$" + "NA" + "&" + blade5 + "&" + "P3011" + "&" +
         arryboth[6] + "$" + "NA" + "&" + blade6 + "&" + "P3012"
        
        boxpoint =
            "&P3011" + "," + boxpoint[1] +
            "&P3012" + "," + boxpoint[2] +
            "&P2011" + "," + boxpoint[3] +
            "&P2012" + "," + boxpoint[4] +
            "&P1011" + "," + boxpoint[5] +
            "P1012" + "," + boxpoint[6] + "#"
          
        console.log("Calis de nueva cadena: ", boxpointcalis)
        logsaving(boxpoint)
        socket.emit('plc_response', boxpointcalis)
        resolve('resolved')
    })
}

function plc_response2(responsevalue){
    return new Promise(async resolve => {
        console.log(responsevalue)
        socket.emit('plc_response2', responsevalue)
        resolve('resolved')
    })
}

/************Canvas de grafica lineal */
async function iniciar2() {
    return new Promise(async resolve => {
        //variable = 15
        let Monday = 'Monday'
        let Tuesday = 'Tuesday'
        let Wednesday = 'Wednesday'
        let Thursday = 'Thursday'
        let Friday = 'Friday'
        let Saturday = 'Saturday'
        let Sunday = 'Sunday'
        //let turno2 = 2
        //let turno3 = 3
        line_ctx = document.getElementById('linea').getContext('2d');
        linea = new Chart(line_ctx, {
            type: 'line',
            data: {
                labels: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday],
                datasets: [{
                    label: 'PASS',
                    data: [],//[variable, 19, 3, 5, 2, 3],
                    backgroundColor: '#66FF66',
                    borderColor: '#66FF66',
                    borderWidth: 1
                }, {
                    label: 'FAIL',
                    data: [],//[5, 9, 6, 2, 1,15],
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    borderWidth: 1
                }]
            },
            options: {

                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
       // console.log(bar)
        resolve('resolved');
    })
}

iniciar2()

async function grafictas(){
    return new Promise(async resolve => {
        const bardos_ctx = document.getElementById('bardos').getContext('2d');
        let PO1011 = 'P1011';let PO1012 = 'P1012';let PO2011 = 'P2011';let PO2012 = 'P2012';let PO3011 = 'P3011';let PO3012 = 'P3012'
        bardos = new Chart(bardos_ctx, {
            type: 'bar',
            data: {
                labels: [null,PO1011,PO1012,PO2011,PO2012,PO3011,PO3012],
                datasets: [{
                    label: 'FAIL-SEMANA',
                    data: [tasArry],//[56,28,30,15,36,20,40,45, 34], 
                    backgroundColor: '#FF0000',
                    borderColor: '#FF0000',
                    borderWidth: 1, 
                }, ]
            },
            options: {
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                beginAtZero: false,
                                grid: {
                                    display: false
                                }
                            }
                        }
                    
                
            }

        });
        //console.log(bar)
        resolve('resolved');
    })
}

grafictas()

//********************************************** Secuencia de prueba */
async function Sequence() {
    document.getElementById('boton').style.visibility = "hidden"
console.log("soy serial "+serial)
    //await st(cadenadedatos)
    arryboth = []
    boxpoint = [] // Reinicia valor para retrabajar punto
    desicion = []

    for (point = 0; point < 3; point++) {
        await open_cam(point)
        console.log("estoy en la camara.. "+point)
        canbughide()
        await captureimage(point)
        //await URIimage(fullimage, 1)
        await predict1(point)
        await recorta(point)
        await stopcam()
    } // Cierre de for puntos
    await evaluaArray() // funcion se coloca fuera de for para evaluar toda la cadena
    eval2puntos()
    await plc_response(boxpoint)
    if(resultado == true){
        renombra(serial)
    }
    setTimeout(function fire() { location.reload() }, 8000);// temporizador para limpiar pantalla
}

//************************************************************************************** Funciones de procesamiento de imagenes */
async function recorta(point) { // Recorte de canvas 
    return new Promise(async resolve => {
        switch (point) {
            case 0:
                // imagen No1
                // P3011
                capturap30tcx.drawImage(fullimage, 8, 285, 1913, 483, 0, 0, 318, 90) // Ajuste de imagen Cropping y resize
                //console.log("ya esta la imagen")
                recortitoctx.drawImage(fullimage, coord1[0], coord1[1], coord1[2], coord1[3], 0, 0, recortitoctx.canvas.width, recortitoctx.canvas.height) // Coordenadas de Blade espada encontrada en segmentacion  
                recortitoctx1.drawImage(fullimage, coord1[4], coord1[5], coord1[6], coord1[7], 0, 0, recortitoctx1.canvas.width, recortitoctx1.canvas.height)// Coordenadas de Blade espada encontrada en segmentacion  
                boxShadow(point)//Sombra en recortes
                await mlinspector(recortito,coord1[0],1) //Coordenadas de recorte y punto de referencia para entrenamiento
                await URIimage(recortito, 0, statusf) //Guarda imagen de recorte 
                console.log(typeof(coord1[0]))
                //pointstatus(1, statusx)
                allpoints(1, statusf)
                evalseparate(1, statusf)
                await mlinspector(recortito1,coord1[4],1)
                await URIimage(recortito1, 0, statusf)
                //pointstatus(2, statusx)
                allpoints(2, statusf)
                evalseparate(2, statusf)
                await snapshot(point)
                break;

            case 1:
                recortitoctx2.drawImage(fullimage, coord2[0], coord2[1], coord2[2], coord2[3], 0, 0, recortitoctx2.canvas.width, recortitoctx2.canvas.height)
                recortitoctx3.drawImage(fullimage, coord2[4], coord2[5], coord2[6], coord2[7], 0, 0, recortitoctx3.canvas.width, recortitoctx3.canvas.height)
                capturap20tcx.drawImage(fullimage, 184, 315, 1739, 435, 0, 0, 321, 90)
                boxShadow(point)
                await mlinspector(recortito2,coord2[0],2)
                await URIimage(recortito2, 2, statusf)
                //pointstatus(3, statusf)
                allpoints(3, statusf)
                evalseparate(3, statusf)
                await mlinspector(recortito3,coord2[4],2)
                await URIimage(recortito3, 2, statusf)
                //pointstatus(4, statusf)
                allpoints(4, statusf)
                evalseparate(4, statusf)
                await snapshot(point)
                break;
            case 2:
                recortitoctx4.drawImage(fullimage, coord3[0], coord3[1], coord3[2], coord3[3], 0, 0, recortitoctx4.canvas.width, recortitoctx4.canvas.height)
                recortitoctx5.drawImage(fullimage, coord3[4], coord3[5], coord3[6], coord3[7], 0, 0, recortitoctx5.canvas.width, recortitoctx5.canvas.height)
                capturap10tcx.drawImage(fullimage, 1, 243, 1916, 565, 0, 0, 321, 90)
                boxShadow(point)
                await mlinspector(recortito4,coord1[0],3)
                await URIimage(recortito4, 3, statusf)
                //pointstatus(5, statusf)
                allpoints(5, statusf)
                evalseparate(5, statusf)
                await mlinspector(recortito5,coord1[4],3)
                await URIimage(recortito5, 3, statusf)
                //pointstatus(6, statusf)
                allpoints(6, statusf)
                evalseparate(6, statusf)
                await snapshot(point)
                break;
            default:
        }

        resolve('resolved')
    })
}

function puntos(point) {
    pointsArray[point] = pointsAll
}

function boxShadow(point) {
    if (point == 0) {
        document.getElementById("Canvascut").style.boxShadow = "10px 20px 30px rgba(96, 95, 99, 0.75)"
        document.getElementById("Canvascut1").style.boxShadow = "10px 20px 30px rgba(96, 95, 99, 0.75)"
    }
    if (point == 1) {
        document.getElementById("Canvascut2").style.boxShadow = "10px 20px 30px rgba(96, 95, 99, 0.75)"
        document.getElementById("Canvascut3").style.boxShadow = "10px 20px 30px rgba(96, 95, 99, 0.75)"
    }
    if (point == 2) {
        document.getElementById("Canvascut4").style.boxShadow = "10px 20px 30px rgba(96, 95, 99, 0.75)"
        document.getElementById("Canvascut5").style.boxShadow = "10px 20px 30px rgba(96, 95, 99, 0.75)"
    }
}

//************************************************************************************** Funciones para dibujar cuadros de status */

function pointstatus(point, statusx) { // funcion que pinta verde o rojo cuadro analizado 
    switch (point) {
        case 1:
            if (statusx == "1") { }
            if (statusx == "0") { }
            break
        case 2:
            if (statusx == '1') { }
            if (statusx == '0') { }
            break
        case 3:
            if (statusx == '1') { }
            if (statusx == '0') { }
            break
        case 4:
            if (statusx == '1') { }
            if (statusx == '0') { }
            break
        case 5:
            if (statusx == '1') { }
            if (statusx == '0') { }
            break
        case 6:
            if (statusx == '1') { }
            if (statusx == '0') { }
            break
        default:
    }
}

function p3011_v() {
    let capturap30 = document.getElementById('imagen_p30')
    let capturap30tcx = capturap30.getContext('2d')

    capturap30tcx.strokeStyle = "#39FF14";
    capturap30tcx.lineWidth = 3;
    capturap30tcx.strokeRect(9, 5, 90, 80)
}
function p3012_v() {
    let capturap30 = document.getElementById('imagen_p30')
    let capturap30tcx = capturap30.getContext('2d')

    capturap30tcx.strokeStyle = "#39FF14";
    capturap30tcx.lineWidth = 3;
    capturap30tcx.strokeRect(225, 7, 90, 80)
}
function p2011_v() {
    let capturap20 = document.getElementById('imagen_p20')
    let capturap20tcx = capturap20.getContext('2d')

    capturap20tcx.strokeStyle = "#39FF14";
    capturap20tcx.lineWidth = 3;
    capturap20tcx.strokeRect(0, 5, 90, 80)
}
function p2012_v() {
    let capturap20 = document.getElementById('imagen_p20')
    let capturap20tcx = capturap20.getContext('2d')

    capturap20tcx.strokeStyle = "#39FF14";
    capturap20tcx.lineWidth = 3;
    capturap20tcx.strokeRect(229, 7, 90, 80)
}
function p1011_v() {
    let capturap10 = document.getElementById('imagen_p10')
    let capturap10tcx = capturap10.getContext('2d')

    capturap10tcx.strokeStyle = "#39FF14";
    capturap10tcx.lineWidth = 3;
    capturap10tcx.strokeRect(7, 2, 90, 80)
}
function p1012_v() {
    let capturap10 = document.getElementById('imagen_p10')
    let capturap10tcx = capturap10.getContext('2d')

    capturap10tcx.strokeStyle = "#39FF14";
    capturap10tcx.lineWidth = 3;
    capturap10tcx.strokeRect(231, 7, 90, 80)
}
function p3011_r() {
    let capturap30 = document.getElementById('imagen_p30')
    let capturap30tcx = capturap30.getContext('2d')

    capturap30tcx.strokeStyle = "#ff0000";
    capturap30tcx.lineWidth = 3;
    capturap30tcx.strokeRect(9, 5, 90, 80)
}
function p3012_r() {
    let capturap30 = document.getElementById('imagen_p30')
    let capturap30tcx = capturap30.getContext('2d')

    capturap30tcx.strokeStyle = "#ff0000";
    capturap30tcx.lineWidth = 3;
    capturap30tcx.strokeRect(214, 5, 90, 80)

}
function p2011_r() {
    let capturap20 = document.getElementById('imagen_p20')
    let capturap20tcx = capturap20.getContext('2d')

    capturap20tcx.strokeStyle = "#ff0000";
    capturap20tcx.lineWidth = 3;
    capturap20tcx.strokeRect(8, 5, 90, 80)
}
function p2012_r() {
    let capturap20 = document.getElementById('imagen_p20')
    let capturap20tcx = capturap20.getContext('2d')

    capturap20tcx.strokeStyle = "#ff0000";
    capturap20tcx.lineWidth = 3;
    capturap20tcx.strokeRect(229, 7, 90, 80)
}
function p1011_r() {
    let capturap10 = document.getElementById('imagen_p10')
    let capturap10tcx = capturap10.getContext('2d')

    capturap10tcx.strokeStyle = "#ff0000";
    capturap10tcx.lineWidth = 3;
    capturap10tcx.strokeRect(7, 2, 90, 80)
}
function p1012_r() {
    let capturap10 = document.getElementById('imagen_p10')
    let capturap10tcx = capturap10.getContext('2d')

    capturap10tcx.strokeStyle = "#ff0000";
    capturap10tcx.lineWidth = 3;
    capturap10tcx.strokeRect(231, 7, 90, 80)
}

//************************************************************************************** Funciones para localizar los Arrays*/
function allpoints(pot, statusl) {
    boxpoint[pot] = statusl// Array guarda el valor de cada punto analizado 
    console.log("boxpoint de allpoints: ",boxpoint)
}

function evalseparate(pot, statusl) {
    arryboth[pot] = statusl// Array guarda el valor de cada punto analizado 
    console.log("arry de evalseparate: ",arryboth)
}


function eval2puntos(){
    blade1 
    bladeA[0] = arryboth[1]
    if(arryboth[1] === 0){
        blade1 = "FAIL"
     }else{
        blade1 = "PASS"
     }

    blade2
    bladeA[1] = arryboth[2]
     if(arryboth[2] === 0){
        blade2 = "FAIL"
     }else{
        blade2 = "PASS"
     }
     bladeA = []

    blade3
    bladeB[0] = arryboth[3]
    if(arryboth[3] === 0){
        blade3 = "FAIL"
     }else{
        blade3 = "PASS"
     }

    blade4
    bladeB[1] = arryboth[4]
     if(arryboth[4] === 0){
        blade4 = "FAIL"
     }else{
        blade4 = "PASS"
     }
     bladeB = []

    blade5
    bladeC[0] = arryboth[5]
    if(arryboth[5] === 0){
        blade5 = "FAIL"
     }else{
        blade5 = "PASS"
     }

    blade6
    bladeC[1] = arryboth[6]
     if(arryboth[6] === 0){
        blade6 = "FAIL"
     }else{
        blade6 = "PASS"
     }
     bladeC = []
}

function evaluaArray() {
    return new Promise(async resolve => {
        let resultadofinal = boxpoint.some((e) => e == "0")
        if (resultadofinal == false) {
            pass()
            pass1 = 1
            plc_response2(pass1)
            passturno()
        } else {
            fail()
             fail0 = 0
            plc_response2(fail0)
            failturno()
        }
        resultado = resultadofinal
        //console.log(boxpoint)
        //console.log(resultadofinal)
        resolve('resolved')
    }) // fin de promesa
}

//************************************************************************************** Funciones de debug*/
let calis = new Image()// Variable utilizada por switchpic

async function loadcalis(fotox) {//Funcion Carga la imagen del modelo 
    return new Promise(async resolve => {
    switchpic(fotox)
    setTimeout(function dibuja() {
        fullimagectx.drawImage(calis, 0, 0, calis.width, calis.height, 0, 0, fullimagectx.canvas.width, fullimagectx.canvas.height)
        canbughide()
    }, 300)
    resolve('resolved')
    })
}
function switchpic(name) {
    return new Promise(async resolve => {
    calis.src = "/img/Camara/RR/Sample30/" + name + ".jpg"
    resolve('resolved')
    })
}
function canbughide() { // funcion para esconder los canvas 
    return new Promise(async resolve => {
        document.getElementById('CanvasFHD').style.visibility = "hidden"
        //document.getElementById('Canvascut').style.visibility = "hidden"
        resolve('resolved')
    });
}
function canbugshow() { // funcion para ver los canvas 
    document.getElementById('Canvascut').style.visibility = "visible"
}
function loadcapturas() { // funcion para cargar imagenes de prueba
    //capturap30tcx.drawImage(image, 0, 0, image.width, image.height, 0, 0, capturap30tcx.canvas.width, capturap30tcx.canvas.height);
    capturap20tcx.drawImage(image2, 0, 0, image2.width, image2.height, 0, 0, capturap20tcx.canvas.width, capturap20tcx.canvas.height);
    //capturap10tcx.drawImage(image3, 0, 0, image3.width, image3.height, 0, 0, capturap10tcx.canvas.width, capturap10tcx.canvas.height);
}

async function pause() {
    return new Promise(async resolve => {
        setTimeout(function pausea() { resolve('resolved') }, 3000)
    });
}

//document.getElementById("myinput").onkeydown = function() {Sequence()}; // inicia la secuencia cuando detecta un texto presionando enter

function search(event) {
    let tecla = event.key

    if (tecla === 'Enter') {
        event.preventDefault()
        console.log("funciona secuencia")
        Sequence()
    }
}


//************************************************************************************** Funciones de camara*/
/*Seccion de camaras  */
function open_cam(point) {// Resolve de 2 segundos

    return new Promise(async resolve => {
        let camid

        if (point == 0) { camid = "551cef2ce5bf21b1833826e51f5a09191ff6161afed26068686c788e327a49a5" } // Camara 30
        if (point == 1) { camid = "0e04c336b1e21a006a3a661f59d96409334500729719ce6522fb694a5603f1e5" } // Camara 10
        if (point == 2) { camid = "9b63c777fcc7f79c808a837d0a1b92952ec6a022d8e47504ad72d7dbcc263b4f" } // Camara 20
        const vgaConstraints = {

            video: {
                width: { ideal: 1080 },
                "frameRate": 30,
                "resizeMode": "crop-and-scale",
                deviceId: camid
            }
        }
        let objetomedia = navigator.mediaDevices.getUserMedia(vgaConstraints)

        await objetomedia.then((stream) => { video.srcObject = stream }).catch(function (err) { 
            console.log(err.name)
            //location.reload()
        })
        setTimeout(function fire() { resolve('resolved'); }, 500)
   
})
}
function captureimage() {// Resolve de 2 segundos
    return new Promise(async resolve => {

        fullimagectx.drawImage(video, 0, 0, fullimage.width, fullimage.height);
        //var dataURI = canvas.toDataURL('image/jpeg');
        setTimeout(function fire(){resolve('resolved');},1500);//Temporal para programacion de secuencia
        resolve('resolved')
    });
}
function mapcams() { // Mapeo de camaras para identificarlas 
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === 'videoinput');
            console.log('Cameras found', filtered);
        });
}
function stopcam() {
    return new Promise(async resolve => {
        const video = document.querySelector('video');
        if(video && video.srcObject){
            const mediaStream = video.srcObject;
            const tracks = mediaStream.getTracks();
            console.log(tracks);
            tracks.forEach(track => track.stop());
        } else {
          console.log("Camara no encontrada");
        }
    
        setTimeout(() => resolve('resolved'), 50);
      });
    }

function snapshot() {//Back end sent URI,SN? & point?
    return new Promise(async resolve => {
        var dataURI = fullimage.toDataURL('image/jpeg');
        savepic(dataURI, serial, point); //savepic(dataURI,point);
        //console.log("Pic Sent--"+sn+"--"+point);
        //setTimeout(function fire(){resolve('resolved');},2000);//Temporal para programacion de secuencia
        resolve('resolved')
    });
}

function savepic(uri,snr,point){
    // let serialnumber="Unit_under_test" 
     //let point = 2           
     const socket = io();
     socket.emit('picsaving2',uri,snr,point);	
}

function renombra(serial){   
socket.emit('renombrasnr',serial);	
}

async function logsaving(logarray,serial){
    return new Promise(async resolve => {
        console.log("Contenido del array:", logarray)
        console.log("entre al log")
       // socket.emit('logsaving',logarray,serial);
        resolve('resolved')
    });
}


/******************************* IA  */
async function predict1(point) {

    fullimage = document.getElementById('CanvasFHD')

    let input_size = model.input_size
    let image = tf.browser.fromPixels(fullimage, 3)
    image = tf.image.resizeBilinear(image.expandDims(), [input_size, input_size])
    let predictions = await model.executeAsync(image)

    await highlightResults(predictions, point) //espera a esta funcion para verificar si tiene corto o no

}
let criterio = 0.0001
async function highlightResults(predictions, punto) {
   
    for (let n = 0; n < predictions[0].length; n++) {

        // Check scores
        if (predictions[1][n] > criterio) {
           console.log(predictions[0])
            bboxLeft = (predictions[0][n][0] * fullimagectx.canvas.width) //900 es el Width de la imagen y hace match con el with del overlay
            bboxTop = (predictions[0][n][1] * fullimagectx.canvas.height) //540 es el Height de la imagen y hace match con el with del overlay
            bboxWidth = (predictions[0][n][2] * fullimagectx.canvas.width) - bboxLeft//800 en vez del video.width
            bboxHeight = (predictions[0][n][3] * fullimagectx.canvas.height) - bboxTop//448 en vez del video.width
            if (punto == 0) {
                coord1.push(bboxLeft)
                coord1.push(bboxTop)
                coord1.push(bboxWidth)
                coord1.push(bboxHeight)
            }
            else if (punto == 1) {
                coord2.push(bboxLeft)
                coord2.push(bboxTop)
                coord2.push(bboxWidth)
                coord2.push(bboxHeight)
            }
            else {
                coord3.push(bboxLeft)
                coord3.push(bboxTop)
                coord3.push(bboxWidth)
                coord3.push(bboxHeight)
            }
        }
        else {
            //console.log("PASEEEE 1")
        }
    }
    console.log(coord1)
}

function st(st) {
    return new Promise(async resolve => {
        elementst = document.getElementById('st')
        //console.log(station)
        elementst.innerHTML = "Serial: " + st + ""
        resolve('resolved')
    })
}

async function URIimage(cut, photo, status) {
    var dataURI = cut.toDataURL('image/jpeg'); //convierte la imagen
    var valor = parseInt(Math.random() * (100 ** 10))
   socket.emit('picsaving', dataURI, valor, photo, status); //se llama la funcion savepic con los 3 parametros (conversion de imagen, numero de serial declarado previamente y samples que sera el point)
}


//****************************************** Backend call functions

function plckatana(p) {
    const socket = io();
    socket.emit('plckatana', p);
}
async function mlinspector(cut,array,pot) {
    return new Promise(async resolve => { // inicio de promesa 
        await call(cut,array,pot) 
        resolve('resolved')
    })
}

async function call(cut,array,pot) {
    if(pot==1){
        //PUNTO 1 DEL CASE 0 --- P1011 Y P1012
        result = await model1.executeAsync(cut)  
    }
    else if(pot==2){
        //PUNTO P2011 Y P2012
        result = await model2.executeAsync(cut)  
    }
    else{
        //PUNTO P3011 Y P3012
        result = await model3.executeAsync(cut) 
    }

    console.log(result)
    falla = result[0][1]
    pasa = result[0][0]

    console.log("pasa",pasa)
    console.log("falla",falla)
    if (pasa >= falla&&array!=null){ //Evalua el valor en la posicion 0 que da la redneuronal
        statusf = 1;
        console.log(statusf)
    }
    else {
        statusf = 0;
        console.log(statusf)
    }
}
   
//*********************************************** Extraer informacion para graficos ****************************************//
async function numsem(){
    if((diaSemana == 0 ||diaSemana == 1 ||diaSemana == 2 ||diaSemana == 3 ||diaSemana == 4 ||diaSemana == 5 ||diaSemana == 6 && (getweek(date)) == getweek(date))){
        await agrupardias('pass', 'Monday', semana)
        await agrupardias('fail', 'Monday', semana)
        await agrupardias('pass', 'Tuesday', semana)
        await agrupardias('fail', 'Tuesday', semana)
        await agrupardias('pass', 'Wednesday', semana)
        await agrupardias('fail', 'Wednesday', semana)
        await agrupardias('pass', 'Thursday', semana)
        await agrupardias('fail', 'Thursday', semana)
        await agrupardias('fail', 'Friday', semana)
        await agrupardias('pass', 'Friday', semana)
        await agrupardias('pass', 'Saturday', semana)
        await agrupardias('fail', 'Saturday',  semana)
        await agrupardias('pass', 'Sunday', semana)
        await agrupardias('fail', 'Sunday',  semana)
        await querytas('fail','fail','fail','fail','fail','fail',day,semana)
        }
}

function agrupardias(statust,day,semana) {
    return new Promise(async resolve => {
        //console.log("Este es agrupa dias en front-end: ",statust,day,semana)
        const socket = io();
        socket.emit('agrupardias', statust, day,semana)
        resolve('resolved');
    })
}

//Extraccion de datos
socket.on('qtyD', function (resulday) {
    let datosday = resulday.result
    turno_pass_qtyD = parseInt(datosday.rows[0].count, 10)
    yieldMonday(resulday)
    yieldTuesday(resulday)
    yieldWednesday(resulday)
    yieldThursday(resulday)
    yieldFriday(resulday)
    yieldSaturday(resulday)
    yieldSunday(resulday)

    linea.data.datasets[resulday.day === 'day', resulday.status == 'pass' ? 0 : 1].data.push(turno_pass_qtyD)
    linea.update()
})

//Extraccion de conteo 
socket.on('qtytas', function (resultas){
    datostas= resultas.result
    p1011fail=parseInt(datostas.rows[0].conteop1011, 10)//analiza una cadena para determinar si contiene un valor entero
    p1012fail=parseInt(datostas.rows[0].conteop1012, 10)
    p2011fail=parseInt(datostas.rows[0].conteop2011, 10)
    p2012fail=parseInt(datostas.rows[0].conteop2012, 10)
    p3011fail=parseInt(datostas.rows[0].conteop3011, 10)
    p3012fail=parseInt(datostas.rows[0].conteop3012, 10)
    tasArry =[null,p1011fail,p1012fail, p2011fail,p2012fail,p3011fail,p3012fail]

    bardos.data.datasets[resultas.P1011== 'fail', resultas.P1012=='fail', resultas.P2011=='fail', resultas.P2012=='fail',resultas.P3011=='fail',resultas.P3012=='fail' ? 0 : 1].data.push(p1011fail,p1012fail, p2011fail,p2012fail,p3011fail,p3012fail)//.data
    bardos.update()
})


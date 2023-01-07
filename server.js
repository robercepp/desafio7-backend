//librerías requeridas
const express = require('express');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const {engine} = require('express-handlebars');
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const mariaDB = require('./options/mariaDB.js');
const sqLite = require('./options/sqLite.js')

//engine handlebars
app.engine('hbs', engine({
    defaultLayout: false
}))

//middlewares
app.set("view engine", "hbs");
app.set("views", "./views")
app.use(express.static('public'))

//servidor
const PORT = 8080
const connectServer = httpServer.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${connectServer.address().port}`))
connectServer.on("error", error => console.log(`Error en servidor ${error}`))

//class
const dBHandler = require("./classes/dbhandler.js")
const chat = new dBHandler(sqLite.options, 'mensajes')
const prod = new dBHandler(mariaDB.options, 'productos')

//"connection" se ejecuta la primera vez que se abre una nueva conexion
io.on('connection', async(socket) => {
    console.log('Nuevo cliente conectado')
    //Envio de los mensajes al cliente que se conecto
    socket.emit('mensajes', await chat.getAll())
    socket.emit('mensaje', await chat.getAll())
    socket.emit('productos', await  prod.getAll())
    socket.emit('producto', await prod.getAll())
    //Escucho los mensajes enviados por el cliente
    socket.on('new-message', async(data) => {
        await chat.save(data)
        io.sockets.emit('mensaje', await chat.getAll())
    })
    socket.on('new-producto', async (data) => {
        await prod.save(data)
        io.sockets.emit('producto', await prod.getAll())
    })
})

app.get('/', async(req, res) =>{
    res.render('main', {titulo: 'Engine Handlebars con Websocket', lista: prod.getAll(), mensajes: chat.getAll()})
})

//funciones para crear las tablas requeridas
//chat.crearTablaChat() (la tabla ya está creada y tiene ya unos mensajes cargados)
//prod.crearTablaProd() creará la tabla "productos" dentro de la base de datos "test" de MySQL
//prod.cargarDatos() también he armado una función que carga 3 productos en la base de datos a modo de ejemplo.
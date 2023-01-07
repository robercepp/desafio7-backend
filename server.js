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
const Chat = require("./classes/chat.js")
const chat1 = new Chat(sqLite.options)
const Catalogo = require("./classes/productos.js")
const prod1 = new Catalogo(mariaDB.options)

//"connection" se ejecuta la primera vez que se abre una nueva conexion
io.on('connection', async(socket) => {
    console.log('Nuevo cliente conectado')
    //Envio de los mensajes al cliente que se conecto
    socket.emit('mensajes', await chat1.getAll())
    socket.emit('mensaje', await chat1.getAll())
    socket.emit('productos', await  prod1.getAll())
    socket.emit('producto', await prod1.getAll())
    //Escucho los mensajes enviados por el cliente
    socket.on('new-message', async(data) => {
        await chat1.save(data)
        io.sockets.emit('mensaje', await chat1.getAll())
    })
    socket.on('new-producto', async (data) => {
        await prod1.save(data)
        io.sockets.emit('producto', await prod1.getAll())
    })
})

app.get('/', async(req, res) =>{
    res.render('main', {titulo: 'Engine Handlebars con Websocket', lista: prod1.getAll(), mensajes: chat1.getAll()})
})

//funciones para crear las tablas requeridas
//chat1.crearTabla() (la tabla ya está creada y tiene ya unos mensajes cargados)
//prod1.crearTabla() creará la tabla "productos" dentro de la base de datos "test" de MySQL
//prod1.cargarDatos() también he armado una función que carga 3 productos en la base de datos a modo de ejemplo.
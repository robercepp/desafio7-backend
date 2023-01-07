module.exports = class Productos {
    constructor(options) {
        this.knex = require('knex')(options)
    }


    //nota: en este caso la tabla será alojada dentro de la base de datos "test" de MySQL
    async crearTabla() {
        this.knex.schema.createTable('productos', table => {
            table.string('title')
            table.integer('price')
            table.string('thumbnail')
        })
            .then(() => console.log('table created'))
            .catch((error) => { console.log(error); throw error })
            .finally(() => {
                this.knex.destroy()
            });
    }

    async cargarDatos() {
        const productos = [
            {
                title: "Libreta de Chicas Gamer",
                price: 12.5,
                thumbnail: "https://cdn2.iconfinder.com/data/icons/cafe-46/512/reading-coffee-chill-cafe-coffee_shop-64.png"
            },
            {
                title: "Sticker de Six Fanarts",
                price: 10.5,
                thumbnail: "https://cdn4.iconfinder.com/data/icons/fox-1/512/sticker_emoji_emoticon_smiley_fox-64.png"
            },
            {
                title: "Poster de Lulu Martins",
                price: 11,
                thumbnail: "https://cdn3.iconfinder.com/data/icons/pirate-flat/340/pirate_wanted_poster_outlaw_vintage_reward_criminal-64.png"
            }
        ];
        this.knex('productos').insert(productos)
            .then(() => console.log('table created'))
            .catch((error) => { console.log(error); throw error })
            .finally(() => {
                this.knex.destroy()
            });
    };

    async save(object) {
        try {
            await this.knex('productos').insert(object)
        } catch (error) {
            console.log('error!: ', error)
        }
    }
    async getAll() {
        try {
            let result = await this.knex.from('productos').select("*")
            return result
        } catch (error) {
            console.log('error!: ', error)
        }
    }
}
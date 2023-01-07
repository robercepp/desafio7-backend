module.exports = class Chats {
    constructor(options) {
        this.knex = require('knex')(options)
    }

    async crearTabla() {
        this.knex.schema.createTable('mensajes', table => {
            table.string('email')
            table.string('diaYHora')
            table.string('text')
        })
            .then(() => console.log('table created'))
            .catch((error) => { console.log(error); throw error })
            .finally(() => {
                this.knex.destroy()
            });
    }

    async save(object) {
        try {
            await this.knex('mensajes').insert(object)
        } catch (error) {
            console.log('error!: ', error)
        }
    }
    async getAll() {
        try {
            let result = await this.knex.from('mensajes').select("*")
            return result
        } catch (error) {
            console.log('error!: ', error)
        }
    }
}
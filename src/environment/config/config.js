import dotenv from 'dotenv'
import params from './params.js'

const mode = params.mode

dotenv.config({
    path:`./.env.${mode}`
})

export default {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI
    
}
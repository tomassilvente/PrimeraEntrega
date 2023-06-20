import {fileURLToPath} from 'url'
import {dirname} from 'path'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname+'/public/data')
        console.log("Ubicacion "+cb)
    },
    filename: function(req, file, cb){
        console.log(file)
        cb(null, file.originalname)
    }
})

export const __dirname = dirname(__filename)
export const uploader = multer({storage})
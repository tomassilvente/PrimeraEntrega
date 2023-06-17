import fs from 'fs'

export default class ProductManager{
    
    constructor(archivo){
        this.archivo = archivo + '.JSON' 
        this.productos = []
        this.id = 1
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.productos = JSON.parse(data)
                    return this.productos
                }
            } 
            else return console.log("Producto no Encontrado") 
        }
        catch (error) {
            throw new Error(error)
        }
    }

    async getProductById(id) {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.productos = JSON.parse(data)
                    const producto = await this.productos.find((prod) => prod.id === Number(id))
                    if (producto) {
                        return producto
                    } else return console.log("Producto no Encontrado")
                }
            } 
            else return  console.log("No existe el archivo")         
        } 
        catch (error){ 
            
        }
    }

    async addProduct(producto, res) {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.productos = JSON.parse(data)
                    
                    if (!producto.title || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.category) {
                        return console.log("Faltan Datos")
                    }
                    if (this.productos.find((prod) => prod.code === producto.code)) {
                        return console.log("Codigo Repetido")
                    } 
                    if (!producto.status || producto.status === "true") producto.status = true
                    else{ 
                        if(producto.status === "false") producto.status = false
                        else return console.log("Status Debe ser true / false")
                    }
                    if (!producto.thumbnails) producto.thumbnails = []
                    producto.price = Number(producto.price)
                    producto.stock = Number(producto.stock)
                    producto.id = this.id 
                    this.id++
                    this.productos.push(producto)
                    await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos, null, "\t"))
                    console.log("Producto Creado")
                }
            } 
            else {
                if (!producto.title || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.category) {
                    return console.log("Faltan Datos")
                }
                if (!producto.status || producto.status === "true") producto.status = true
                    else{ 
                        if(producto.status === "false") producto.status = false
                        else return console.log("Status Debe ser true / false")
                    } 
                if (!producto.thumbnails) producto.thumbnails = []
                producto.price = Number(producto.price)
                producto.stock = Number(producto.stock)
                producto.id = 1
                this.productos.push(producto)
                await fs.promises.writeFile(this.archivo, JSON.stringify([producto], null, "\t"))
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateProductById(id, producto, res) {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.productos = JSON.parse(data)
                    const index = this.productos.findIndex((prod) => prod.id === Number(id))
                    if (index !== -1) {
                        this.productos[index] = { ...this.productos[index], ...producto }
                        await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos, null, "\t"))
                        
                    }
                    else return console.log("Producto no Encontrado")
                } 
                else return console.log("Archivo no encontrado")
            }
        } 
        catch (error) { 
            throw new Error(error) 
        }
    }

    async removeProductById(id, res) {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.productos = JSON.parse(data)
                    const index = this.productos.findIndex((prod) => prod.id === Number(id))
                    if (index !== -1) {
                        this.productos.splice(index, 1)
                        await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos, null, "\t"))
                    }
                } 
                else return console.log("Producto no encontrado")     
            } 
            else return console.log("Archivo no encontrado")
        } 
        catch (error) {
            throw new Error(error)
        }
    }
    async removeAllProducts() {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.productos = []
                    await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos, null, "\t"))
                    return console.log("Productos Eliminados")
                } 
                else return console.log("No se encontraron productos")
            }
        } 
        catch (error) {
            throw new Error(error)
        }
    }
}

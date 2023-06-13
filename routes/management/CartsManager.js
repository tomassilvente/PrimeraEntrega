import fs from 'fs'

export default class CartManager{

    constructor(archivo){
        this.archivo = archivo + '.JSON'
        this.carts = []
        this.id = 1
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.carts = JSON.parse(data)
                    return this.carts
                }
            } 
            else console.log("Archivo no Encontrado")
        }
        catch (error) {
            throw new Error(error)
        }
    }

    async getCartById(id) {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.carts = JSON.parse(data)
                    let cart = this.carts.findIndex((c) => c.id === id)
                    return this.carts[cart]
                }
                else console.log("Producto no Encontrado")
            } 
            else console.log("Archivo no existente")   
        } 
        catch (error){ 
            throw new Error(error)             
        }
    }

    async addProducts( producto, idCart = null) {
        try {
            if (fs.existsSync(this.archivo)) {
                const data = await fs.promises.readFile(this.archivo, "utf-8")
                if (data) {
                    this.carts = JSON.parse(data)
                    if(producto.length < 2)
                        if (!producto.id || !producto.quantity) {
                            return console.log("Datos Faltantes")
                        }
                        else{ 
                            if(idCart !== null){ 
                                const cart = this.getCartById(idCart)
                                if(cart)
                                    if(cart.products.find((prod) => prod.id === Number(producto.id))){
                                        let index = cart.products.findIndex((prod) => prod.id === Number(producto.id))
                                        cart.products[index].quantity += quantity
                                        await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"))
                                        console.log("Cantidad Sumada al producto")
                                    }
                                    else{
                                        cart = {...cart, ...producto}
                                        await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"))
                                        console.log("Producto agregado al carrito")
                                    }
                                else return console.log("Carrito no existente")
                            }
                            else{
                                let cart = {id: this.id, products: []}
                                this.id++
                                producto.id = Number(producto.id)
                                cart.products.push(producto)
                                this.carts.push(cart)
                                await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"))
                                console.log("Producto Almacenado")
                            }
                        }
                    else{
                        if(idCart !== null){ 
                            const cart = this.getCartById(idCart)
                            if(cart)
                                for(let i = 0; i<producto.length; i++){
                                    if (!producto[i].id || !producto[i].quantity) {
                                        return console.log("Faltan Datos")
                                    }
                                    else{
                                        if(cart.products.find((prod) => prod.id === Number(producto[i].id))){
                                            let index = cart.products.findIndex((prod) => prod.id === Number(producto[i].id))
                                            cart.products[index].quantity += producto[i].quantity
                                            await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"))
                                            console.log("Cantidad Sumada al producto")
                                        }
                                        else{
                                            cart = {...cart, ...producto[i]}
                                            await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"))
                                            console.log("Producto agregado al carrito")
                                        }
                                    }
                                }
                            else return console.log("Carrito no existente")
                        }
                        else{
                            let cart = {id: this.id, products: []}
                            this.id++
                            for(let i = 0; i<producto.length; i++){
                                if (!producto[i].id || !producto[i].quantity) {
                                    return console.log("Faltan Datos")
                                }
                                producto[i].id = Number(producto[i].id)
                                if(cart.products.find((prod) => prod.id === Number(producto[i].id))){
                                    let index = cart.products.findIndex((prod) => prod.id === Number(producto[i].id))
                                    cart.products[index].quantity += producto[i].quantity
                                    console.log("Cantidad Sumada al producto")
                                }
                                else cart.products.push(producto[i])
                            }                           
                            this.carts.push(cart)
                            await fs.promises.writeFile(this.archivo, JSON.stringify([this.carts], null, "\t"))
                            console.log("Producto Creado")
                        }
                        }
                    }
                }
             
            else {
                if(producto.length>1){
                    let cart = {id: this.id, products: []}
                    this.id++
                    for(let i = 0; i<producto.length; i++){
                        if (!producto[i].id || !producto[i].quantity) {
                            return console.log("Faltan Datos")
                        }
                        else{
                            producto[i].id = Number(producto[i].id)
                            if(cart.products.find((prod) => prod.id === Number(producto[i].id))){
                                let index = cart.products.findIndex((prod) => prod.id === Number(producto[i].id))
                                cart.products[index].quantity += producto[i].quantity
                                console.log("Cantidad Sumada al producto")
                            }
                            else cart.products.push(producto[i])
                        }
                    }
                    this.carts.push(cart)
                    await fs.promises.writeFile(this.archivo, JSON.stringify([this.carts], null, "\t"))
                    console.log("Producto Creado")
                }
                else{
                    let cart = {id: this.id, products: []}
                    this.id++
                    producto.id = Number(producto.id)
                    cart.products.push(producto)
                    this.carts.push(cart)
                    await fs.promises.writeFile(this.archivo, JSON.stringify(this.carts, null, "\t"))
                    console.log("Producto Almacenado")
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}
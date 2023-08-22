import Products from '../services/products.service.js'

class ProductsController{
    async getProducts (req, res){
        //let products = await manager.getProducts()
        let products = await Products.getAll()
        res.send({products})
    }

    async getProduct (req, res){
        //let product = await manager.getProductById(req.params.pid)
        let product = await Products.getById(req.params.pid)
        res.send({product})
    }

    async createProduct (req,res){
        let product = req.body
        let result = await Products.saveProducts(product)
        res.send({status:"OK", message:"Producto agregado correctamente", payload:result})
    }

    async updateProduct (req,res){
        let id = req.params.pid
        let product = req.body
        if(product.id)
            res.status(400).send({status:"Error", error:"No se puede modificar ID"})
        else Products.uptdateProduct(id,product) //manager.updateProductById(id, product)
        res.send({status:"OK",message:"Producto Modificado Exitosamente"})
    }

    async deleteProduct (req,res){
        let id = req.params.pid
        Products.deleteProduct(id)
        res.send({status:"OK", message:"Productos completamente eliminados"})
    }
}

export default new ProductsController()
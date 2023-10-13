import Carts from './mongo/carts/carts.dao.js'
import Products from './mongo/products/products.dao.js'

export const getDAOS = () =>{
    return{
        Carts,
        Products
    }
}
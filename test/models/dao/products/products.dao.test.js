import mongoose from "mongoose"
import { getDAOS } from "../../../../src/models/daos/indexDAO.js"
import Assert from "assert"
import chai from "chai"

const {Products} = getDAOS()

mongoose.connect('mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/?retryWrites=true&w=majority')

const expect = chai.expect

describe("Testing Products DAO", ()=>{
    before(function(){
        this.productsDao = Products
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    
    it("El dao debe devolver los productos en formato de arreglo", async function(){
        //Given
        Assert.ok(this.productsDao)
        const isArray = true
        //When

        //Then
        const result = await this.productsDao.getAll()

        //Assert
        Assert.strictEqual(Array.isArray(result), true)
    })

    it("El dao debe devolver los productos en formato de arreglo", async function(){
        //Given
        let mockProducts = {
            title:"Producto de prueba",
            description:"Descripcion",
            price:999,
            code:"a1",
            status:true,
            stock: 999,
            category:"test",
            thumbnail: ["","a"],
            owner:"Owner@Owner.test"
        }
        //When

        //Then
        const result = await this.productsDao.saveProducts(mockProducts)

        //Assert
        Assert.ok(result._id)

         //Given
         let mockProducts2 = {
            title:"Producto de prueba",
            description:"Descripcion",
            price:999,
            code:"a1",
            status:true,
            stock: 999,
            category:"test",
            thumbnail: ["","a"],
            owner:"Owner@Owner.test"
        }
        //When

        //Then
        const result2 = await this.productsDao.saveProducts(mockProducts)

        //Assert
        expect(result2._id).to.be.ok
    })
})
import mongoose from "mongoose"
import { getDAOS } from "../../../../src/models/daos/indexDAO.js"
import Assert from "assert"
import chai from "chai"

const {Carts} = getDAOS()

mongoose.connect('mongodb+srv://silventetomas:tomassilvente10@cluster0.w7dcotg.mongodb.net/?retryWrites=true&w=majority')

const expect = chai.expect

describe("Testing Carts DAO", ()=>{
    before(function(){
        this.cartsDao = Carts
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    
    it("El dao debe devolver los carritos en formato de arreglo", async function(){
        //Given
        Assert.ok(this.cartsDao)
        const isArray = true
        //When

        //Then
        const result = await this.cartsDao.getAll()

        //Assert
        Assert.strictEqual(Array.isArray(result), true)
    })

    it("El dao debe devolver los carritos en formato de arreglo", async function(){
        //Given
        let mockcarts = {
            products : ["Product1", "Product 2", "Product3"]
        }
        //When

        //Then
       
        const result = await this.cartsDao.saveCarts(mockcarts)

        //Assert
        Assert.ok(result._id)

         //Given
         let mockCarts2 = {
            products : ["Product6", "Product 7", "Product8"]
        }
        //When

        //Then
        const result2 = await this.cartsDao.saveCarts(mockCarts2)

        //Assert
        expect(result2._id).to.be.ok
    })
})
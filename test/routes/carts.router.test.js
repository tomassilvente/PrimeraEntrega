import {expect} from "chai"
import { dropCarts } from "../setup.test"
import supertest from 'supertest'

const requester =  supertest(`http://localhost:3000`)

describe("Carts Router test Case", ()=>{
    before(async () =>{
        await dropCarts()
    })
    it('[POST] expect a 200 for correct data', async () =>{
        const mockCart={
            products:["Product1", "Product 2", "Product3"]
        }
        const response = await requester.post('/api/carts').send(mockCart)
        
        expect(response.statusCode).to.be.eql(200) 
        expect(response.body.payload._id).to.be.ok
        expect(response.body.payload.products).to.be.eql(["Product1", "Product 2", "Product3"])
        await dropCarts()
    })
    it('[POST] expect a 400 because of wrong data', async () =>{
        const mockCart={ }
        const response = await requester.post('/api/carts').send(mockCart)
        expect(response.statusCode).to.be.eql(400) 
        await dropCarts()
    })
})
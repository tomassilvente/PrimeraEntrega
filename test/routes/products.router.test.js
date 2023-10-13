import {expect} from "chai"
import { dropProducts } from "../setup.test"
import supertest from 'supertest'

const requester =  supertest(`http://localhost:3000`)

describe("Carts Router test Case", ()=>{
    before(async () =>{
        await dropProducts()
    })
    it('[POST] expect a 200 for correct data', async () =>{
        const mockProducts = {
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
        const response = await requester.post('/api/products').send(mockProducts)
        expect(response.statusCode).to.be.eql(200) 
        expect(response.body.payload._id).to.be.ok
        expect(response.body.payload.title).to.be.eql("Producto de prueba")
        await dropProducts()
    })
    it('[POST] expect a 400 because of wrong data', async () =>{
        const mockProducts={ 
            title:"Producto de prueba",
            code:"a1",
            status:true,
            stock: 999,
            category:"test",
            thumbnail: ["","a"],
            owner:"Owner@Owner.test"
        }
        const response = await requester.post('/api/products').send(mockProducts)
        expect(response.statusCode).to.be.eql(400) 
        await dropProducts()
    })
    it('[GET] api/products - todos los carros correctamente', async function(){
        const response = await requester.get('/api/products')
        expect(response.body.payload.length).to.be.eql(1)
    })
    it('[GET] api/products - todos los carros correctamente', async function(){
        const response = await requester.get('/api/products')
        expect(response.body.payload.length).to.be.eql(1)
    })
})
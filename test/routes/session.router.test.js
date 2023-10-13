import {expect} from "chai"
import { dropSessions } from "../setup.test"
import supertest from 'supertest'

const requester =  supertest(`http://localhost:3000`)

describe("Carts Router test Case", ()=>{
    before(async () =>{
        await dropSessions()
    })
    it('[POST] expect a 200 for correct data & correct session cookie', async () =>{
        const mockSessions = {
            first_name: 'Test',
            last_name: 'Test',
            email: 'test@test.com',
            age: 1,
            password:'Test',
            cart:[],
            role:'Tester'
        }
        const response = await requester.post('/api/session').send(mockSessions)
        const cookie = response.headers[`set-cookie`][0]
        expect(cookie).to.be.ok
        expect(response.statusCode).to.be.eql(200) 
        expect(response.body.payload._id).to.be.ok
        expect(response.body.payload.first_name).to.be.eql("Test")
        await dropSessions()
    })

    
}) 
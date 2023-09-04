import getDAOS from "../daos.factory.js";
import {SaveCartDTO} from "../dtos/carts.dto.js"

const {cartsDAO}= getDAOS();

export class CartsRepository{
    constructor(){
        this.dao= cartsDAO;
    }
    async getAllCarts(){
        return await this.dao.getAll();
    }
    async saveCart(payload){
        const cartsPayload = new SaveCartDTO(payload)
        return await this.dao.saveCart(cartsPayload)
    }
}
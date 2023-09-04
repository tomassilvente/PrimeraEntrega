export class SaveProductsDTO {
    constructor(payload){
        this.products= payload.products;
        this.title = payload.title  
        this.description = payload.description
        this.price = payload.price
        this.code = payload.code
        this.status = payload.status
        this.stock = payload.stock
        this.category = payload.category
        this.thumbnail = payload.thumbnail
    }
}
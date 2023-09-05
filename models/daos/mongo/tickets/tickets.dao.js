import { MongoManager } from "../../../db/mongo/mongo.manager.js"
import { ticketModel } from "../../../schemas/tickets.schema.js"

class Ticket{
    constructor(){
        MongoManager.start()
    }

   async generateTicket(ticket){
    if(ticket.code || ticket.purchase_datetime || ticket.amount || ticket.purcharser){
        let result = await ticketModel.create(ticket)
        return result
    }
    else return console.log("Datos Faltantes")
   }
}

export default new Ticket()
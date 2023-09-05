import { MongoManager } from "../../../db/mongo/mongo.manager.js"
import { ticketModel } from "../../../schemas/tickets.schema.js"

class Ticket{
    constructor(){
        MongoManager.start()
    }

   async generateTicket(ticket){
    if(ticket.purchase_datetime || ticket.amount || ticket.purcharser){
        ticket.code = ticket.purcharser + ticket.purchase_datetime
        let result = await ticketModel.create(ticket)
        return result
    }
    else return console.log("Datos Faltantes")
   }
}

export default new Ticket()
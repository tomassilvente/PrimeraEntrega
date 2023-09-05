import Ticket from '../models/daos/mongo/tickets/tickets.dao.js'

class ticketController{
    async generateTicket(req,res){
        let ticket = req.body
        const result =  await Ticket.generateTicket(ticket)
        const response = successResponse(result);
        res.status(HTTP_STATUS.CREATED).json(response)  
    }
}
export default new ticketController()
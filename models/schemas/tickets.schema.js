import mongoose from "mongoose";

const ticketCollection = 'tickets'
const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: String,
    amount: Number,
    purcharser: {
        type: Array,
    },
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel
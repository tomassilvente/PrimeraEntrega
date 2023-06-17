import ProductManager from "../../routes/management/ProductManager.js"

const socket = io();

let prodMan = new ProductManager('public/data/products')

const log = document.getElementById('log')

socket.on('log', async data=>{
    let logs = await prodMan.getProducts()
    data.logs.forEach(log=>{
        logs +=`${log.message} <br/>`
    })
    log.innerHTML=logs
})
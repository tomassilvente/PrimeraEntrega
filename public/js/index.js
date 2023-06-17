const socket = io();

const productos = document.getElementById('prods')

productos.addEventListener('input',evt=>{
    if(evt === productos){
        socket.emit('message', productos)
    }
})

socket.on('productos',data=>{
    let prods=''
    data.productos.forEach(prods=>{
        prods += `Produco ${productos.title}<br />`
    })
    productos.innerHTML=prods
})
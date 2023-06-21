const socket = io();

const productos = document.getElementById('prods')
const form = document.getElementById('form')
const eliminar = document.getElementById('delete')

form.addEventListener('click', (evt)=>{
    let title = document.getElementById('title').value
    let description = document.getElementById('description').value
    let price = document.getElementById('price').value
    let code = document.getElementById('code').value
    let status = document.getElementById('status').value
    let stock = document.getElementById('stock').value
    let category = document.getElementById('category').value
    let prod = {title,description,price,code,status,stock,category}
    socket.emit('products', prod)
})

eliminar.addEventListener('click',(evt)=>{
    let id = Number(document.getElementById('id').value)
    socket.emit('eliminar',id)
})

socket.on('products', data => {
    
    let prodsHTML = '';
    data.products.forEach(producto => {
        prodsHTML += `<h4>${producto.title}</h4>${producto.description} <br> Precio: $${producto.price} <br> id:  ${producto.id}<hr/>`;
    });

    // Actualizar la vista con los nuevos productos
    productos.innerHTML = prodsHTML;

});
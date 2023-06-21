const socket = io();

const productos = document.getElementById('prods')

socket.emit('products', productos)

productos.addEventListener('input', evt => {

    const inputValue = evt.target.value;

    // Emitir el valor del input a través del socket

    socket.emit('products', inputValue);

});

socket.on('products', data => {
   
    let prodsHTML = '';

    data.products.forEach(producto => {
        console.log(producto)
        prodsHTML += `Producto: ${producto.title}<br/> precio: $${producto.price} <hr/>`;
    });

    // Actualizar la vista con los nuevos productos
    productos.innerHTML = prodsHTML;
});


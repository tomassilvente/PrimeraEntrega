const socket = io();

const productos = document.getElementById('prods');

socket.emit('message', productos)

// productos.addEventListener('input', evt => {

//     const inputValue = evt.target.value;

//     // Emitir el valor del input a través del socket

//     socket.emit('message', inputValue);

// });

socket.on('productos', data => {
    console.log(data)
    let prodsHTML = '';

    data.productos.forEach(producto => {
        prodsHTML += `Producto: ${producto.title}`;
    });

    // Actualizar la vista con los nuevos productos
    productos.innerHTML = prodsHTML;
});
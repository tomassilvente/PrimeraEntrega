const socket = io();

let user
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title:"Bienvenido a nuestro chat",
    input:"text",
    text:"Ingrese su nombre: ",
    inputValidator:(value) =>{
        return !value && "Se requiere un nombre para continuar!"
    },
    allowOutsideClick:false,
}).then(result =>{
    user = result.value
})

//CHAT

chatBox.addEventListener('keypress', evt=>{
    if(evt.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {user:user, message:chatBox.value})
            chatBox.value=''
        }
    }
})

socket.on('messageLog',data=>{
    let log = document.getElementById('messageLogs')
    let messages = ""

    data.forEach(message =>{
        messages +=`${message.user} :  ${message.message} <br>`    
    })
    log.innerHTML = messages 
})

socket.on('newUserConnected', data=>{
    Swal.fire({
        text:"Nuevo usuario conectado",
        toast:true,
        position:"top-right"
    })
})
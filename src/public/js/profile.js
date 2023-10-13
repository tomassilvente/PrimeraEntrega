fetch('/api/current',{
    method:'GET',
    headers:{
        'authorization':`$localStorage.getItem('token')`
    }
}).then(response => {
    if(response.status === 401){
        window.location.replace('/login')
    }
    else{
        return response.json()
    }
}).then(json=>{
    const parametros = document.getElementById('result')
    parametros.innerHTML = `Hola los datos son ${json.payload.email} y ${json.payload.password}`
})
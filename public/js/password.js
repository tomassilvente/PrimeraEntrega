const form =document.getElementById('passwordForm')

form.addEventListener('submit', evt =>{
    evt.preventDefault();
    const data= new FormData(form);
    const obj={}
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/session/changepassword',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            window.location.replace('/')
        }
    })
})
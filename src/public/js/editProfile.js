const editUser = document.getElementById('editUser')

editUser.addEventListener('submit', evt =>{
    evt.preventDefault();
    let id = document.getElementById('id').value
    let editUser = document.getElementById('editUser')
    const data= new FormData(editUser);
    const obj={}
    data.forEach((value,key)=>obj[key]=value);
    fetch(`/api/users/${id}`,{
        method:'PUT',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            window.location.replace(`/editUser/${id}`)
        }
    })
})
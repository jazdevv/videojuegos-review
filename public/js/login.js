let loginbtn = document.getElementById("btn-login");

// const login = function() {
//     console.log(mail);
//     console.log(password);
// };

loginbtn.addEventListener("click",() => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    const res = axios.post("http://127.0.0.1:3000/api/login",{
        email: email,
        password: password
    })
    .then((res)=> {
        //redirect 
        console.log('logined');
        window.location.replace('/me');
    }).catch((err)=>{console.log(err)});

});
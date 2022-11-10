function LoginUser(form){
    const xhttp = new XMLHttpRequest();
    var formdata = new FormData(form);
    xhttp.open("POST", "http://localhost:8080/api/auth/login");
    xhttp.send(formdata);
}
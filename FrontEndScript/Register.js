function RegisterUser(form){
    const xhttp = new XMLHttpRequest();
    var formdata = new FormData(form);
    xhttp.open("POST", "http://localhost:8080/api/auth/signup");
    xhttp.send(formdata);
}
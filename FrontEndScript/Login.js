function LoginUser(){
    let form = document.querySelector('#login-form')

    const xhttp = new XMLHttpRequest();
    var formdata = new FormData(form);

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const messages = JSON.parse(this.response);

            console.log('incoming', messages)
        }
    };

    xhttp.open("POST", "http://localhost:8080/api/auth/login");
    xhttp.send(formdata);
}
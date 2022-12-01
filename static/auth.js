function userLogin(){
    authRequest('/api/auth/login', document.querySelector('#login-form'))
}
function userSignup(){
    authRequest('/api/auth/signup', document.querySelector('#signup-form'))
}

function authRequest(url, form) {
    let box = document.querySelector('#warning-box')
    box.style.display = 'none'
    const xhttp = new XMLHttpRequest();
    var formdata = new FormData(form);
    xhttp.onreadystatechange = function () {
        let warnText = null

        if (this.readyState === 4) {
            const messages = JSON.parse(this.response);
            if (messages.success === true){
                window.location = ('/');
            } else {
                warnText = messages.error || 'Magical Error Occurred'
            }
        }

        if (warnText) {
            box.innerHTML = warnText
            box.style.display = 'block'
        }
    };
    xhttp.open("POST", "/api/auth/login");
    xhttp.send(formdata);
}
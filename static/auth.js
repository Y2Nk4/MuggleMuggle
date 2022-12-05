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
                warnText = 'Successfully! Teleporting you to the correct place.'
                setTimeout(() => {
                    window.location = ('/');
                }, 2000)
            } else {
                warnText = messages.error || 'Magical Error Occurred'
            }
        }

        if (warnText) {
            box.innerHTML = warnText
            box.style.display = 'block'
        }
    };
    xhttp.open("POST", url);
    xhttp.send(formdata);
}

function userLogout(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4){
            const messages = JSON.parse(this.response);
            if (messages.success === true){
                alert('Logout Success');
                window.location = '/';
            }
            else{
                alert('Logout Error');
            }
        }
    };
    xhttp.open("POST", "/api/auth/logout");
    xhttp.send()
}
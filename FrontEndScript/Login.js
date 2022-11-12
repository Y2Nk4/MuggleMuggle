function LoginUser(){
    let form = document.querySelector('#login-form')
    const xhttp = new XMLHttpRequest();
    var formdata = new FormData(form);
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            const messages = JSON.parse(this.response);
            if (messages.success === true){
                alert('Login Success');
                window.location = ('http://localhost:8080/Home');
            }
            else if (messages.error === 'User has been logged in'){
                alert('User has been logged in');
            }
            else if (messages.error === 'Please enter your email and password'){
                alert('Please enter your email and password');
            }
            else if (messages.error === 'Email and password does not match'){
                alert('Email and password does not match');
            }
            else{
                alert('Error on Login');
            }
        }
    };
    xhttp.open("POST", "http://localhost:8080/api/auth/login");
    xhttp.send(formdata);
}
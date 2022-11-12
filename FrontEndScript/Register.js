function RegisterUser(){
    let form = document.querySelector('#Login-form')
    const xhttp = new XMLHttpRequest();
    var formdata = new FormData(form);
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            const messages = JSON.parse(this.response);
            if (messages.success === true){
                alert('Register Success');
                window.location = ('http://localhost:8080/Home');
            }
            else if (messages.error === 'User has been logged in'){
                alert('User has been logged in');
            }
            else if (messages.error === 'Please enter your email, password, firstname and lastname'){
                alert('Please enter your email, password, firstname and lastname');
            }
            else if (messages.error === 'Password does not match'){
                alert('Password does not match');
            }
            else if (messages.error === 'Email has been used'){
                alert('Email has been used');
            }
            else{
                alert('Error on Register');
            }
        }
    };
    xhttp.open("POST", "http://localhost:8080/api/auth/signup");
    xhttp.send(formdata);
}
function LogoutUser(){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4){
            const messages = JSON.parse(this.response);
            if (messages.success === true){
                alert('Logout Success');
                window.location = ('http://localhost:8080/');
            }
            else{
                alert('Logout Error');
            }
        }
    };
    xhttp.open("POST", "http://localhost:8080/api/auth/logout");
    xhttp.send()
}
function ShowOrHide(){
    let a = document.getElementById("Auction");
    let c = document.getElementById("ShoppingCart");
    let s = document.getElementById("Selling");
    let p = document.getElementById("Profile");
    let l = document.getElementById("Logout");
    const elem = [a,c,s,p,l];
    if (a.style.display == 'block'){
        for (var e of elem){
            e.style.display = 'none';
        }
    }
    else {
        for (var e of elem){
            e.style.display = 'block';
        }
    }
}
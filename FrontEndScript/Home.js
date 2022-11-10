function LogoutUser(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8080/api/auth/logout");
}
function ShowOrHide(){
    let a = document.getElementById("Auction");
    let c = document.getElementById("ShoppingCart");
    let s = document.getElementById("Selling");
    let p = document.getElementById("Profile");
    let l = document.getElementById("Logout");
    const elem = [a,c,s,p,l];
    if (a.style.display == "none"){
        for (var e of elem){
            e.style.display = "block";
        }
    }
    else {
        for (var e of elem){
            e.style.display = "none";
        }
    }
}
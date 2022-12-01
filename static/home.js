function getUserInfo() {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {

        }
    }
    xhttp.open('GET', '/api/user/userInfo')
    xhttp.send()
}

window.onload = function () {
    getUserInfo()
}
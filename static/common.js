async function fetchUserInfo(requireLogin = false) {
    let failed = false
    let returnResult = { userInfo: null, userLoggedIn: false}
    let resp = await fetch('/api/user/userInfo', {
        method: 'GET'
    }).catch((error) => {
        console.log(error)
        failed = true
    })
    if (!failed) {
        let result = await resp.json();
        if (result && result.success) {
            returnResult.userInfo = result.data
            returnResult.userLoggedIn = true
        }
    }
    if (requireLogin && !returnResult.userLoggedIn) {
        window.location = '/login.html'
    }
    return returnResult
}

async function userLogout() {
    console.log('user logged out')
    let resp = await fetch('/api/auth/logout', {
        method: 'POST'
    }).catch((error) => {
        console.log(error)
    })
    window.location = '/'
}

function displayError(error) {
    let box = document.querySelector('#warning-box')
    if (box) {
        if (error) {
            box.innerHTML = error
            box.style.display = 'block'
        } else {
            box.innerHTML = ''
            box.style.display = 'none'
        }
    }
}
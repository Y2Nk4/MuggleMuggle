<h1 style="text-align: center">Muggle Muggle</h1>

### Project Set-Up
1. Clone the Proect
2. Run `npm install` in the terminal to install packages.

### Run Express Server
1. Run `node main.js` to start the server

Should show as the following.
```shell
jiahaoguo@MacBook-Pro-53 MuggleMuggle % node main.js 
Example app listening on port 3000
```

## Start working on the Project

### Backend:
The following is the layout of the project
```shell
├── README.md
├── config.js
├── controllers
│   ├── auction.js
│   ├── auth.js
│   ├── home.js
│   ├── listing.js
│   ├── shoppingcart.js
│   └── user.js
├── db.js
├── main.js
├── package-lock.json
├── package.json
└── router.js
```
#### 从哪开始

1. 业务逻辑需要写在 `controllers` 的 `controller` 内，
并按功能分开放在不同的文件内，譬如 登录/注册 相关的功能写在
`controllers/auth.js` 内

#### Postman WorkSpace
   1. 加入 WorkSpace: [Invite Link](https://app.getpostman.com/join-team?invite_code=db6ceb1e56a8c715e1d6eed1a32f5733&target_code=30a67f6c92f514b83baf3d3180c20470)

#### Finished API
- Auth
  1. [POST] Login: /api/auth/login [email, password]
  2. [POST] Sign up: /api/auth/signup [email, firstname, lastname, password, confirmPassword]
  3. [POST] Logout: /api/auth/logout
- User
  1. [GET] Get User Info: /api/user/userInfo
     2. [POST] Update User Info: /api/user/userUpdateInfo [email, firstname, lastname]
  3. [POST] Update Password: /api/user/changePassword [password, confirmPassword]

#### Q&A
1. 如何使用 MongoDB
   1. DB 已经在 Express 启动的时候，由中间件注入到 `response`
   对象中(`response.db`)
   2. 在写 `controller` 中的业务逻辑中时，只需要调用 `resp.db`
   即可访问数据库内容
   
2. 如何返回数据
   1. Long Story Short:
      `res.send('User Info');` or `res.end('User Info');`
   2. 看 [documentation](https://expressjs.com/)
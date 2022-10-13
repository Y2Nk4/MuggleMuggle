## Muggle Muggle

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

1. 业务逻辑需要写在`controllers`的 `controller` 内，
并按功能分开放在不同的文件内，譬如 登录/注册 相关的功能写在
`controllers/auth.js` 内
<h1 style="text-align: center">Muggle Muggle</h1>

### Grading Info
Online Deployment: [MuggleMuggle.store](https://mugglemuggle.store/)

#### Local Deploy
Note: Local Deploy will use a **Self-Signed** SSL Certificate for HTTPS traffic
```shell
docker-compose up
```

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
#### How to Start

1. Web Logics code should be put in the `controllers` directory,
and separate the codes in different files by their functionality,
for example login/register related code should be put in
`controllers/auth.js`

#### Postman WorkSpace
   1. Join WorkSpace: [Invite Link](https://app.getpostman.com/join-team?invite_code=db6ceb1e56a8c715e1d6eed1a32f5733&target_code=30a67f6c92f514b83baf3d3180c20470)

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
1. How to use MongoDB
   1. DB has been add to the Koa `context` object (`context.service.db`)
      during startup by middleware.
   2. When you write controller logics in `controllers`，you can access 
   the db by access object `ctx.service.db`
   
   
2. How to return a HTTP response
   1. Long Story Short:
      `res.send('User Info');` or `res.end('User Info');`
   2. Or checkout [documentation](https://expressjs.com/)
// routes/user.js
const express = require('express')
const router = express.Router()
const User = require('../models/user') // 載入user model
const passport = require('passport')
const bcrypt = require('bcryptjs') // 載入 bcryptjs library

// login page
router.get('/login', (req, res) => {
    res.render('login')
})

// login check
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {  // 使用 passport 認證 
        successRedirect: '/',
        failureRedirect: '/users/login'
    })(req, res, next)
})

// register page
router.get('/register', (req, res) => {
    res.render('register')
})

// register check
router.post('/register', (req, res) => {
    console.log('req.body', req.body)
    const { name, email, password, password2 } = req.body

    // 加入錯誤訊息提示
    let errors = []
    if (!name || !email || !password || !password2) {
        errors.push({ message: '所有欄位都是必填' })
    }

    if (password != password2) {
        errors.push({ message: '密碼輸入錯誤' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                // 如果 email 已經存在的話，將不能送出，並回到註冊表單頁面
                console.log('User already exists')
                res.render('register', {
                    error,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                // 如果 email 不存在就新增使用者
                // 新增完成後導回首頁
                const newUser = new User({
                    name,
                    email,
                    password
                })
                console.log('Add new user: ', newUser)
                // 先用 genSalt 產生「鹽」，第一個參數是複雜度係數，預設值是 10
                bcrypt.genSalt(10, (err, salt) =>
                    // 再用 hash 把鹽跟使用者的密碼配再一起，然後產生雜湊處理後的 hash
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        newUser.password = hash
                        // 用 bcrypt 處理密碼後，再把它儲存起來
                        newUser
                            .save()
                            .then(user => {
                                res.redirect('/')
                            })
                            .catch(err => console.log(err))
                    })
                )

            }
        })
    }


})

// logout
router.get('/logout', (req, res) => {
    req.logout()
    // 加入訊息提示
    req.flash('success_msg', '你已經成功登出')
    res.redirect('/users/login')
})

module.exports = router
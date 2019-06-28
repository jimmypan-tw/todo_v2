// routes/user.js
const express = require('express')
const router = express.Router()
const User = require('../models/user')

// login page
router.get('/login', (req, res) => {
    res.render('login')
})

// login check
router.post('/login', (req, res) => {
    res.send('login')
})

// register page
router.get('/register', (req, res) => {
    res.render('register')
})

// register check
router.post('/register', (req, res) => {
    console.log('req.body', req.body)
    const { name, email, password, password2 } = req.body
    User.findOne({ email: email }).then(user => {
        if (user) {
            // 如果 email 已經存在的話，將不能送出，並回到註冊表單頁面
            console.log('User already exists')
            res.render('register', { name, email, password, password2 })
        } else {
            // 如果 email 不存在就新增使用者
            // 新增完成後導回首頁
            console.log('Add new user: ', user)
            const newUser = new User({
                name,
                email,
                password
            })
            newUser
                .save()
                .then(user => {
                    res.redirect('/')
                })
                .catch(err => console.log(err))
        }
    })
})

// logout
router.get('/logout', (req, res) => {
    res.send('logout')
})

module.exports = router
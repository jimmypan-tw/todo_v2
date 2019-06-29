const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

// 載入 auth middleware 裡的authenticated 方法
const { authenticated } = require('../config/auth')


// 設定首頁路由器
// Todo 首頁
// 加入 authenticated 驗證
router.get('/', authenticated, (req, res) => {
    Todo.find({})
        .sort({ name: 'asc' })
        .exec((err, todos) => {
            // 把Todo model所有的資料都抓回來
            if (err) return console.error(err)
            return res.render('index', { todos: todos })
        })
})
module.exports = router
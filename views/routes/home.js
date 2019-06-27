const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

// 設定首頁路由器
// Todo 首頁
router.get('/', (req, res) => {
    Todo.find({})
        .sort({ name: 'asc' })
        .exec((err, todos) => {
            // 把Todo model所有的資料都抓回來
            if (err) return console.error(err)
            return res.render('index', { todos: todos })
        })
})
module.exports = router
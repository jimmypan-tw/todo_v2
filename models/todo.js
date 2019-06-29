// ./models/todo.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const todoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    // 加入 userId，建立跟 User 的關聯
    userId: {
        type: Schema.Types.ObjectId, // 定義為一個 Mongoose 的 ObjectId
        ref: 'User',
        index: true, // 把 userId 設定成index 
        required: true
    }
})
module.exports = mongoose.model('Todo', todoSchema)
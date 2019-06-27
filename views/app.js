const express = require('express')
const app = express()
const port = 3003
// 引用body-parser
const bodyParser = require('body-parser')

// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// 引用express-handlebars
const exphbs = require('express-handlebars')
// 告訴express使用handlebars作為template engine並預設layout為'main'
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 引用 method-override
const methodOverride = require('method-override')

// 設定 method-override
app.use(methodOverride('_method'))

// 引用並設定mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/todo', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected.')
})

// 載入todo model
const Todo = require('./models/todo')

// 載入router
app.use('/', require('./routes/home'))
app.use('/todos', require('./routes/todo'))

app.listen(port, () => {
    console.log('App is running...')
})
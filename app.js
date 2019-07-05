const express = require('express')
const app = express()

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {   // 如果不是 production 模式
    require('dotenv').config()                  // 使用 dotenv 讀取 .env 檔案
}

const port = 3003
// 引用body-parser
const bodyParser = require('body-parser')

// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// 引用express-handlebars
const exphbs = require('express-handlebars')

// 載入 express-session 與 passport
const session = require('express-session')
const passport = require('passport')


// 告訴express使用handlebars作為template engine並預設layout為'main'
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 引用 method-override
const methodOverride = require('method-override')

// 設定 method-override
app.use(methodOverride('_method'))

// 引用並設定mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/todo', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected.')
})

// 載入todo model
const Todo = require('./models/todo')
// 載入 connect-flash 
const flash = require('connect-flash')


// 使用 express session 
app.use(session({
    secret: '123abc', // your secret key
    resave: 'false',
    saveUninitialized: 'false'
}))

// 使用 passport
app.use(passport.initialize())
app.use(passport.session())

// 載入 Passport config
// 從./ config / passport.js 中 export 出來的是一個函式，它需要接收一個 Passport
// instance。所以在 require('./config/passport')(passport) 這行程式碼裡，我們將第二
// 個passport 當作參數傳到./config/passport.js 裡。
require('./config/passport')(passport)

// 使用connect-flash
app.use(flash())

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
    res.locals.user = req.user
    // 辨識使用者是否已經登入的變數，讓 view 可以使用
    res.locals.isAuthenticated = req.isAuthenticated
    // 新增兩個 flash message 變數 
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    next()
})



// 載入router
app.use('/', require('./routes/home'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))    // 把 auth route 加進來

app.listen(port, () => {
    console.log('App is running...')
})
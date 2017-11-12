const express = require('express')
const session = require('express-session')
const OrientoStore = require('connect-oriento')(session);
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false}))
app.use(session({
    secret: 'asdfsdfsdfsfd',
    resave: false,
    saveUninitialized: true,
    store: new OrientoStore({
        server: 'host=localhost&port=2424&username=root&password=1234&db=o2'
    })
}))

app.get('/count', (req, res) => {
    req.session.count = req.session.count ? req.session.count + 1 : 1
    res.send(`count : ${req.session.count}`)
})

app.get('/auth/login', (req, res) => {
    let output = `
        <h1>Login</h1>
        <form action='/auth/login' method='post'>
            <p>
                <input type='text' name='username' placeHolder='username' />
            </p>
            <p>
                <input type='password' name='password' placeHolder='password' />
            </p>
            </p>
            <p>
                <input type='submit' />
            </p>
        </form>
    `

    res.send(output)
})

app.get('/welcome', (req, res) => {
    if (req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href='/auth/logout'>Logout</a>
        `)
    } else {
        res.send(`
            <h1>Welcome</h1>
            <a href='/auth/login'>Login</a>
        `)
    }
})

app.get('/auth/logout', (req, res) => {
    // req.session.destroy()
    // res.redirect('/welcome')
    delete req.session.displayName
    req.session.save(() => {
        res.redirect('/welcome')
    })
})

app.post('/auth/login', (req, res) => {
    let user = {
        username: 'aaa',
        password: '111',
        displayName: 'AAA'
    }
    let username = req.body.username
    let password = req.body.password
    if (user.username === username && user.password === password) {
        req.session.displayName = user.displayName
        req.session.save(() => {
            res.redirect('/welcome')
        })
    } else {
        res.send(`Who are you? <a href='/auth/login/'>Login</a>`)
    }
})

app.listen(3003, () => {
    console.log('connected 3003 port')
})
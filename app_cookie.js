const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser('asdfsdfsdfsfd'))

const products = {
    0: 'Mask',
    1: 'Pack'
}

app.get('/products', (req, res) => {
    let output = ''
    for (let name in products) {
        output += `
            <li><a href='/cart/${name}'>${products[name]}</a></li>
        `
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href='/cart'>Cart</a>`)
})
/**
 * cart = {
 *  0: 3,
 *  1: 2
 * }
 */
app.get('/cart/:id', (req, res) => {
    let id = req.params.id
    let cart = req.signedCookies.cart ? req.signedCookies.cart : {}
    cart[id] = cart[id] ? parseInt(cart[id], 10) + 1 : 1
    res.cookie('cart', cart, { signed: true })
    res.redirect('/cart')
})
app.get('/cart', (req, res) => {
    let cart = req.signedCookies.cart ? req.signedCookies.cart : {}
    let output = ''
    for (let name in cart) {
        output += `
            <li>${products[name]} (${cart[name]})</li>
        `
    }
    res.send(`<h1>Cart</h1><ul>${output}</ul><a href='/products'>Products</a>`)
})

app.get('/count', (req, res) => {
    let count = req.signedCookies.count ? parseInt(req.signedCookies.count, 10) + 1 : 1
    res.cookie('count', count, { signed: true })
    res.send(`count ${count}`)
})

app.listen(3003, () => {
    console.log('connected 3000 port')
})

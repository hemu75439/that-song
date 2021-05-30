const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
require('dotenv').config()
const expressEjsLayouts = require('express-ejs-layouts')



app.use(express.static('public'))
app.use(expressEjsLayouts)
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const basics = require('./router/basics')
const song = require('./router/song')
const playlist = require('./router/playlist')


app.use('/', basics)
app.use('/song', song)
app.use('/playlist', playlist)




app.listen(port, ()=> {
    console.log("App running on port: " + port)
})
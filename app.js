require("dotenv").config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const cookieparser = require('cookie-parser');
const mongostore = require("connect-mongo");
const session = require("express-session");
const flash = require('connect-flash')


const app = express();
const PORT = 5000 || process.port.PORT

//connect to db
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieparser());
app.use(methodOverride('_method'));
app.use(session({
    secret: "keyboard",
    resave: false,
    saveUninitialized: true,
    store: mongostore.create({
        mongoUrl: process.env.MONGODB_URL
    }),

}));
app.use(flash());


app.use(express.static('public'));

//template engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))


app.listen(PORT, ()=>{
    console.log(`app is listening to port: ${PORT}`)
});
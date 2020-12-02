/*"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\users\opilane\data\db"*/

require('dotenv').config();
const express = require("express");
const md5 = require("md5");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const encrypt = require('mongoose-encryption');
//const ejs = require("ejs");
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.DB_HOST,
{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});    //SECRET on võetud .env failist
const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) =>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((error) => {
        if(error){
            console.log(error);
        }
        else{
            res.render('secrets');
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const userName = req.body.username;
    const password = md5(req.body.password);

    User.findOne({
        email: userName,
        password: password
    }, (error, userFound) => {
        if(error){
            console.log(error);
        }
        else{
            if(userFound){
                if(userFound.password === password){
                    res.render('secrets');
                }
                else{
                    res.render('login');
                }
            }
        }
    });
});

app.get('/logout', (req, res) => {
    res.render('home');
});

app.listen(3000, () => {
    console.log("connected on port 3000");
});
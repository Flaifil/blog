//Framework express
var express = require('express');
var app = express();
var path = require('path'); //Lire les fichiers html

//Enregistrement formulaire
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Mode API, pour que REACT récupere les données
const cors = require('cors');
app.use(cors());

//Method PUT et DELETE DANS LE FRONT
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//ENCODAGE DES MOTS DE PASSE API 
const bcrypt = require('bcrypt');

//SYSTEME DE VUE EJS
app.set('view engine', 'ejs');

// UTILISATION DES COOKIES:
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//IMPORT JWT
const { createTokens, validateToken } = require('./JWT');

//BDD
require('dotenv').config();
var mongoose = require('mongoose');
const url = "mongodb+srv://lina:minecraft@cluster0.vrq9dlx.mongodb.net/Formulaire?retryWrites=true&w=majority";
// const url = process.env.DATABASE_URL;


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log('MongoDB connected'))
    .catch(err => console.log(err))
  
    //Appelles des modèles
    var Form = require('./modeles/Formulaire');
    const User = require('./modeles/User');
    const Blog = require('./modeles/Blog');


// Blog ROUTES
app.post('/submit-blog',upload.single('image'), function(req, res) {
    const Data = new Blog({
        titre : req.body.titre,
        username : req.body.username,
        imageName: req.body.imageName
    });

    Data.save().then(() =>{
        res.send('File and Data uploaded successfully')
    }).catch(err => console.log(err));
})

app.get('/myblog', function (req, res) {
    Blog.find().then((data) => {
        res.json(data);
    });
});

// Formulaire Route
app.get("/", function(req, res) {
    res.sendFile(path.resolve('formulaire.html'));
})

// CONTACT ROUTES
app.post("/submit-data-form", function (req, res) {
    const Data = new Form({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        message: req.body.message
    });

    Data.save().then(() => {
        res.redirect('/')
    }).catch(err => console.log(err))
});

app.get("/", function (req, res) {
    Form.find().then(data => {
        console.log(data);
    }).catch(err => console.log(err))
})

// route pour l'affichage de la page Signin
app.get("/signin", function (req, res){
res.render('Signin');
})

// route pour la création d'un User
app.post("/api/signin", function(req, res){
const Data = new User({
username: req.body.username,
email: req.body.email,
password: bcrypt.hashSync(req.body.password,10)
})

Data.save().then(()=>{
console.log("User saved !");
res.redirect('/');
});
});

// route Login
app.get("/login", function (req, res){
res.render('Login');
})

app.post('/api/login', function(req, res){
    User.findOne(
        {
            email : req.body.email
        }
    )
    .then( user => {
    if(!user){
        res.status(404).send('No user found');
    }
    console.log(user);

    if(user.password != req.body.password ){
         return res.status(404).send('Invalid password');
        }

    if(!bcrypt.compareSync(req.body.password, data.password)){
            return res.status(404).send('password not match');
        }

res.render('UserPage',{data:user})
    }).catch(err => console.log(err));
});

 //Systeme de vue : EJS
app.set('view engine', 'ejs');

//Afficher la page Home et les données
app.get("/", function (req, res) {
    Form.find().then(data => {
        res.render('Home', { data: data });
    }).catch(err => console.log(err))
})

// Editer les données
app.get('/contact/:id', (req, res) => {
    Form.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Edit', { data: data });
    })
        .catch(err => console.log(err));
});

app.put('/contact/edit/:id', function (req, res) {
    const Data = {
        prenom: req.body.prenom,
        nom: req.body.nom,
        age: req.body.age,
        email: req.body.email,
        message: req.body.message
    };

    Form.updateOne({ _id: req.params.id }, { $set: Data })
        .then((result) => {
            console.log(result);
            res.redirect('/')
        }).catch((err) => {
            console.log(err);
        });
});app.delete('/contact/delete/:id', function(req, res){
    Form.findOneAndDelete({
        _id: req.params.id,
    }).then(() => {
        console.log("Data deleted")
        res.redirect('/');
    }).catch(err => console.log(err));
})



//Method PUT et DELETE dans le front
const methodOverride = require('method-override')
app.use(methodOverride('_method'));

app.delete('/form/delete/:id', (req, res) => {
    Form.findOneAndDelete({
        _id: req.params.id
    }).then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
});

// Model User qui nous permettra de gérer les utilisateurs.
app.post("/api/signup", function(req, res){
const Data = new User({
username: req.body.username,
email: req.body.email,
password: req.body.password
})
Data.save().then(()=>{
console.log("Data saved !");
res.redirect('/');
});
});
const express = require("express");
const router = express.Router();
const post = require("../models/post");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.jwtSecret;

// 
// 
// check login
const authMiddleware = (req, res, next)=>{
  const token = req.cookies.token

  if(!token){
    return res.status(401).json({message: "unauthorized"});
  }

  try{
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  }catch(error) {
    
    return res.status(401).json({message: "unauthorized"});
  }
}


// GET
// admin 
// login page

router.get('/admin', async(req, res)=>{

    try {
      
        const locals = {
            title: "Admin",
            description: " simple blog api with nodejs, express, ejs and mongoDB"
        }
    res.render('admin/login', {locals})

    } catch (error) {
        console.log(error)
    }
})

// POST
// admin 
// admin- check login
router.post('/admin', async(req, res)=>{

    try {
      const {email, password}  = req.body 
      
      const user = await User.findOne({email});

      if(!user) {
        return res.status(401).json( {message: "invalid credentials"});
      }

      const ispasswordvalid = await bcryptjs.compare(password, user.password);

      if(!ispasswordvalid) {
        return res.status(401).json( {message: "invalid crediagtials"});
      }

      const token = jwt.sign({ userId: user.__id}, jwtSecret);
      res.cookie("token", token, {httpOnly: true});

      res.redirect('/dashboard')
  
    } catch (error) {
        console.log(error)
    }
})


/*
GET
admin dashboard
*/

router.get('/dashboard', authMiddleware ,async(req, res)=>{
  const locals = {
    title: "Admin",
    description: " simple blog api with nodejs, express, ejs and mongoDB"}

try {
  const data = await post.find();
  res.render('admin/dashboard', {
    locals,
    data,
    layout: adminLayout,
  });
} catch (error) {
  console.log(error)
}
})

/*
GET
Admin-create new Post
*/

router.get('/add-post', authMiddleware ,async(req, res)=>{
  
try {
  const locals = {
    title: "Add post",
    description: " simple blog api with nodejs, express, ejs and mongoDB"}


  const data = await post.find();
  res.render('admin/add-post', {
    locals,
    data,
    layout: adminLayout
  });
} catch (error) {
  console.log(error)
  res.send("cant connect")
}
})


/*
POST
Admin-create new Post
*/

router.post('/add-post', authMiddleware ,async(req, res)=>{

try{
const newpost = new post({
  title: req.body.title,
  body: req.body.body
})

await post.create(newpost);
res.redirect("/dashboard");

  
} catch (error) {
  console.log(error)
}
})



/*
GET
Admin-create new Post
*/

router.get('/edit-post/:id', authMiddleware ,async(req, res)=>{

  try{
  const locals = {  title: "Edit post",
    description: "a simple blog app with mongodb, nodejs, express and ejs",
  }

const data = await post.findOne({ _id: req.params.id});
res.render('admin/edit-post', {
  locals,
  data,
  layout: adminLayout
,  message: req.flash('message')
});

  }
  
    
 catch (error) {
    console.log(error)
    res.render('error');
  }})

/*
PUT
Admin- edit Post
*/

router.put('/edit-post/:id', authMiddleware ,async(req, res)=>{

  try{
await post.findByIdAndUpdate(req.params.id,{
  title: req.body.title, 
  body: req.body.body, 
  updatedAt: Date.now()})
  req.flash('message', 'updated successfully!')
res.redirect(`/edit-post/${req.params.id}`);
  }
  
    
 catch (error) {
    console.log(error)
  }})
  


// POST
// admin- register
router.post('/register', async(req, res)=>{

    try {
      const {firstname, lastname, username, email, password}  = req.body 
      const hashedpassword = await bcryptjs.hash(password, 10);

    try {
      const user = await User.create({firstname, lastname, username, email, password: hashedpassword});
      // res.status(201).json({message: "user created", user});
      res.redirect('admin');
    } catch (error) {
      if(error.code === 11000){
        res.status(409).json({message: 'user already in use'})
      }
      // res.status(500).json({message:"internal server error"})
    }
      
    }
     catch (error) {
        console.log(error)
    }
});


/*
PUT
Admin- edit Post
*/

router.delete('/delete-post/:id', authMiddleware ,async(req, res)=>{

  try{
await post.deleteOne({_id: req.params.id});
res.redirect('/dashboard');
  }
  
 catch (error) {
    console.log(error)
    res.send(error);
  }});
  



/*
GET- Admin logout
*/
router.get('/logout', (req, res)=>{
res.clearCookie('token');
res.redirect('/');
} )

/*
GET- error
*/

router.get('*',async(req, res)=>{

  try{

res.render('error');
  }
  
    
 catch (error) {
    console.log(error)
  }})

module.exports = router;
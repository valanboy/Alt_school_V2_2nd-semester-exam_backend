const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const post = require('../models/post')

// GET
// HOME

//routes
router.get('/', async(req, res)=>{
    const locals = {
        title : "Gil's BloggingAPI",
        description : "a simple blog app with mongodb, nodejs, express and ejs"
    }

    try{
        const data = await post.find();
        res.render("index",{locals, data});
    }

    catch(error){
        econsole.log(error);
    }
})

// function insertPostData() {
//     post.insertMany({
//         title: "building a blog",
//         body: "hi men of war"
//     }
//     )
// }

// insertPostData();

router.get('/about', (req, res)=>{
    res.render("about");
})

module.exports = router;
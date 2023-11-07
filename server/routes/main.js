const express = require("express");
const { get } = require("mongoose");
const router = express.Router();
const post = require("../models/post");

// GET
// HOME

//routes
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Gil's BloggingAPI",
      description: "a simple blog app with mongodb, nodejs, express and ejs",
    };

    let perPage = 20;
    let page = req.query.page || 1;
    
    const data = await post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextpage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextpage ? nextPage : null
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

// GET
// post
router.get("/post/:id", async (req, res) => {
      try{

        const locals = {
            title: "Gil's BloggingAPI",
            description: "a simple blog app with mongodb, nodejs, express and ejs",
          };
      
          let slug = req.params.id; 

      const data = await post.findById({_id: slug})
      res.render('post', {
        locals,
        data
      });
     
  } catch (error) {
    console.log(error);
  }
  });

// function insertPostData() {
//   post.insertMany([
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//     {
//       title: "bullo",
//       body: "dont know what this is",
//     },
//   ]);
// }

// insertPostData();

module.exports = router;

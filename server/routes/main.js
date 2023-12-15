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
      nextPage: hasNextpage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

// GET
// post:id
router.get("/post/:id", async (req, res) => {
      try{

          let slug = req.params.id; 

      const data = await post.findById({_id: slug})
      const locals = {
        title: data.title,
        description: "a simple blog app with mongodb, nodejs, express and ejs",
      };
  

      res.render('post', {
        locals,
        data,
      });
     
  } catch (error) {
    console.log(error);
  }
  });

  // GET
// post -serachTerm

router.post("/search", async (req, res) => {
  try{

    const locals = {
      title: "search",
      description: "a simple blog app with mongodb, nodejs, express and ejs",

    };
  

      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

      const data = await post.find({
        $or: [
          {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
          {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
        ]
      })

  res.render("search", {
    data, locals
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

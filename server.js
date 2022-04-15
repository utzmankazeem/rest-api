const express = require("express");
        req = require("express/lib/request");
        mongoose = require("mongoose");
        ejs = require("ejs");

const PORT = 2010;
const log = console.log;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true});

    const articleSchema = {
        title: String,
        content: String
    }

    const Article = mongoose.model("Article", articleSchema);

//Chained Route Handlers Using Express    
app.route("/articles")

///////////////////////Request Targetting all Article/////////////////////////////
.get(function(req, res){
    Article.find(function(er, foundArticles){
        if(!er){
          res.send(foundArticles);
        } else {
            res.send(er);
        }
    });
})

.post(function(req, res){
    const {title, content} = req.body;
    
    const newArticle = new Article ({
        title : title,
        content : content
    })
    newArticle.save(function(er){
        if(!er){
            res.send("SUccessfully added article.");
        } else {
            res.send(er);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(er){
        if(!er){
            res.send("Successfully deleted all");
        } else {
            res.send(er); 
        }
    });
});

///////////////////////Request Targeting Specific Article/////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){
    const title = req.params.articleTitle;
    Article.findOne({title: title}, function(er, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("NO articles found match title");
        }
    });
})

.put(function(req, res){
    const {title, content} = req.body;
    const articleTitle = req.params.articleTitle;
    Article.updateOne(
        {title: articleTitle},
        {title, content},
        //{overwrite: true},
        function(er){
            if(!er){
                res.send("updated successfully");
            } else {
                res.send(er)
            }
        })
})

.patch(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.updateOne(
        {title : articleTitle},
        {$set : req.body},
        function(er){
            if(!er){
                res.send("Successfully updated intended field.");
            } else {
                res.send(er);
            }
        }
    );
})

.delete(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.deleteOne(
        {title : articleTitle},
        function(er){
            if(!er){
                res.send("Successfully deleted this article");
            } else {
                res.send("No article found")
            }
    });
});

app.listen(PORT, () => log("server started on port 2010"))
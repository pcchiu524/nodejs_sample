var collections = ["dpuser"];
var db;
var mongo;
var http        = require("http");
var logger      = require("../utils/logger.js");
var express     = require('express');
var router       = express.Router();

var configuration = function(){
    if(process.env.VCAP_SERVICES){
        var env = JSON.parse(process.env.VCAP_SERVICES);
        if(env['mongodb-2.4']){
            mongo = env['mongodb-2.4'][0]['credentials'];
            
        }
        //logger.info("vcap: " + env['mongodb-2.4'][0]['credentials'])
    }
    else{
        mongo = {
            url : "mongodb://localhost:27017/db"
        };
    }
    db = require("mongojs").connect(mongo.url,collections);
};

// Mongo Test
var get_mongo_api = function(request,response){

    var docs = {
        "test" : "abc"
    };

    db.dpuser.findOne(docs,function(err,user){

        if(err){
            logger.error("DB Error!!!!");
            response.json(500,"Internal Server Error");
        }
        else if(!user){
            logger.info("200 OK");
            //response.json(400,"Cannot find user");
            response.json(200,"OK");
        }
        else{
            response.json(200,user.test1);
        }
    });
};

var post_mongo_api = function(request,response){
           
    var docs = {
        "test" : "abc",
        "test1" : "cde"
    }

    // Save to db
    db.dpuser.save(docs);

    response.json(200);
};

var delete_mongo_api = function(request,response){
           
    var docs = {
        "test" : "abc"
    }

    // delete to db
    db.dpuser.remove(docs);

    response.json(200);
};

router.get("/",get_mongo_api);
router.post("/",post_mongo_api);
router.delete("/",delete_mongo_api);

configuration();

module.exports = router;

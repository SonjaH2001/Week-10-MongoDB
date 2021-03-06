var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    req.db.collection('flowers').distinct('color', function(err, colorDocs){
        if (err) {
            return next(err)
        }

        if (req.query.color_filter) {

            req.db.collection('flowers').find({"color":req.query.color_filter}).toArray(function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs, 'color_filter': req.query.color_filter});
            });

        } else {
            req.db.collection('flowers').find().toArray(function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs});

            });
        }
    });
});

router.get('/details/:flower', function(req, res, next){
    req.db.collection('flowers').findOne({'name' : req.params.flower}, function(err, doc) {
        if (err) {
            return next(err);  // 500 error
        }
        if (!doc) {
            return next();  // Creates a 404 error
        }
        return res.render('flower_details', { 'flower' : doc });
    });
});
//post-changed findOne params vs. get params.
//added the findOne to search agains database before adding.
//send a message if exists
//add to db if doesn't
//add err handling.
router.post('/addFlower', function(req, res, next){
    req.db.collection('flowers').findOne({'name' : req.body.name}, function(err, doc) {
        if (err) {
            return next(err);  // 500 error
        }
        // unneeded
        // if (!doc) {
        //     return next();  // Creates a 404 error
        // }
        if (doc) {
            return res.send("already exists");
        }
        req.db.collection('flowers').insertOne(req.body, function(err){
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    });
});
//add error handler
router.put('/updateColor', function(req, res, next) {

    var filter = { 'name' : req.body.name };
    var update = { $set : { 'color' : req.body.color }};

    req.db.collection('flowers').findOneAndUpdate(filter, update, function(err) {
        if (err) {
            return next(err);
        }
        return res.send({'color' : req.body.color})
    })
});
//don't forget to restart server.
//added router and function to delete item from db.
//gets the text from user input
//add error handler
router.post('/deleteFlower', function(req, res, next){
    // err handling won't work becasue not err argument (it's in the next callback)
    // if (err) {
    //     return next(err);  // 500 error
    // }
    // if (!doc) {
    //     return next();  // Creates a 404 error
    // }
    req.db.collection('flowers').findOneAndDelete(req.body, function(err){
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    });
});

//don't forget to restart server!!
module.exports = router;
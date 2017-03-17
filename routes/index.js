var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    req.db.collection('flowers').distinct('color', function (err, colorDocs) {
    if (err) {
      return next(err)
  }
    req.db.collection('flowers').find().toArray(function(err,docs){
        if (err) {
            return next(err)
        }
       return res.render('all_flowers', { 'flowers': docs , 'colors' :colorDocs});
});//end of inner query
  });//end of outer query
});//end of callback


router.get('/details/:flower', function(req,res,next){
    req.db.collection('flowers').findOne({'name' :req.params.flower}, function(err,doc) {
        if (err) {
            return next(err); //500 error
        }
        if (!doc) {
            return next(); //404 errror
        }
        return res.render('flower_details', { 'flower' : doc});
    });
});
module.exports = router;

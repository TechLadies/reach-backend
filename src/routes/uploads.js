const express = require('express');
const router = express.Router();
const pagination = require('../middlewares/pagination')

const db = require('../models/index');

router.get('/', function (req, res, next) {
  
    db.Upload.findAll().then(uploads => {
    res.json(uploads)
  });

});

// /latest
router.get('/latest', function (req, res, next) {
  
        db.Upload.findAll({
            order:[
              //
              ['uploadDate', 'DESC'],
            ]
        }).then(uploads => {
    res.json(uploads[0])
    //      db.Upload.findOne({
    //         order:[
    //           //
    //           [db.sequelize.fn('max', db.sequelize.col('uploadDate')), 'DESC'],
    //         ]
    //     }).then(uploads => {
    // res.json(uploads)
  });
        
});

module.exports = router;
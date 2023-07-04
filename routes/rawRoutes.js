const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

// import models and other required dependencies
const Task = require('../models/task');
const RawMaterial = require('../models/rawMaterial');
const Raw = require('../models/rawmodel');
router.use(methodOverride('_method'));
// Add a route for rendering the raw material form
router.get('/raw', function (req, res) {
    return res.render('raw', {
      title: 'Insert Raw Material'
    });
  });
// rendering the App Page
router.get('/', function (req, res) {
  Task.find({})
    .populate('rawMaterial') // Populate the 'rawMaterial' field
    .exec(function (err, tasks) {
      if (err) {
        console.log('Error in fetching tasks from the database', err);
        return;
      }

      return res.render('raw', {
        title: "raw",
        tasks: tasks
      });
    });
});


  
  router.post('/create-raw', function (req, res) {
    Raw.create({
        name: req.body.name,
        raw_brand: req.body.raw_brand
      }, function (err, newTask) {
        if (err) {
          console.log('Error in creating raw material', err);
          return;
        }
    
        // Redirect to the appropriate page
        return res.redirect('back');
      });
    });

// Updating Tasks
router.post('/update-raw/:id', function (req, res) {
    const id = req.params.id;
    const { name, raw_brand } = req.body;
  
    Raw.findByIdAndUpdate(
      id,
      { name, raw_brand },
      function (err, raw) {
        if (err) {
          console.log('Error in updating raw ', err);
          return res.redirect('back');
        }
  
        return res.redirect('/raw');
      }
    );
  });
  
  // Deleting Tasks
  router.post('/delete-raw', function (req, res) {
    const rawIds = req.body.rawId;
  
    // Convert rawMaterialIds to an array if it's not already
    const rawIdsArray = Array.isArray(rawIds) ? rawIds : [rawIds];
  
    rawIdsArray.forEach(rawId => {
      Raw.findByIdAndDelete(rawId, function (err) {
        if (err) {
          console.log('Error in deleting raw ', err);
        }
      });
    });
  
    return res.redirect('back');
  });


module.exports = router;


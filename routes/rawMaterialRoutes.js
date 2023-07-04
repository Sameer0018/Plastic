const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

// import models and other required dependencies
const Task = require('../models/task');
const RawMaterial = require('../models/rawMaterial');
router.use(methodOverride('_method'));

// Add a route for rendering the raw material form
router.get('/rawmaterial', function (req, res) {
    return res.render('rawmaterial', {
      title: 'Insert Raw Material'
    });
  });
  router.get('/todotask', function(req, res) {
    res.render('todotask'); // Assuming 'todotask.ejs' is the correct filename
  });
// rendering the App Page
router.get('/', function (req, res) {
    RawMaterial.find({}, function (err, rawtasks) {
        if (err) {
            console.log('Error in fetching tasks from db');
            return;
        }
  
        return res.render('rawmaterial', {
            title: "rawmaterial",
            rawtasks: rawtasks
        });
    });
  });
  
// Creating Tasks
router.post('/create-rawmaterial', function (req, res) {
    RawMaterial.create({
        Material: req.body.Material,
        Materialname: req.body.Materialname,
        Materialtype: req.body.Materialtype,
        current_cost: req.body.current_cost,
        vendor_information: req.body.vendor_information,
        inventory_level: req.body.inventory_level
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
 // Updating Tasks
router.post('/update-rawmaterial/:id', function (req, res) {
    const id = req.params.id;
    const { Material, Materialname, Materialtype, current_cost,vendor_information, inventory_level } = req.body;

    RawMaterial.findByIdAndUpdate(
        id,
        { Material, Materialname, Materialtype, current_cost,vendor_information, inventory_level },
        function (err, rawmaterial) {
            if (err) {
                console.log('Error in updating raw material', err);
                return res.redirect('back');
            }

            return res.redirect('/rawmaterial');
        }
    );
});


// Deleting Tasks
router.get('/delete-rawmaterial', function (req, res) {
    const rawMaterialIds = req.query.rawMaterialId;

    // Convert rawMaterialIds to an array if it's not already
    const rawMaterialIdsArray = Array.isArray(rawMaterialIds) ? rawMaterialIds : [rawMaterialIds];

    rawMaterialIdsArray.forEach(rawMaterialId => {
        RawMaterial.findByIdAndDelete(rawMaterialId, function (err) {
            if (err) {
                console.log('Error in deleting raw material', err);
            }
        });
    });

    return res.redirect('back');
});
module.exports = router;

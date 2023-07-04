const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

// import models and other required dependencies
const Task = require('../models/task');
const RawMaterial = require('../models/rawMaterial');
const ProductMaterial = require('../models/productMaterial');

router.use(methodOverride('_method'));

// Add a route for rendering the raw material form
router.get('/productmaterial', function (req, res) {
    return res.render('productmaterial', {
      title: 'Insert Product Material'
    });
  });

// rendering the App Page
router.get('/', function (req, res) {
    ProductMaterial.find({}, function (err, producttasks) {
        if (err) {
          console.log('Error in fetching tasks from db');
          return;
        }
    
        return res.render('productmaterial', {
          title: "productmaterial",
          producttasks: producttasks
        });
      });
    });
    router.get('/create-productmaterial', function (req, res) {
        return res.render('productmaterial', {
          title: 'Insert Product Material'
        });
      });
  
// Creating Tasks
router.post('/create-productmaterial', function (req, res) {
    ProductMaterial.create({
        product_id: req.body.product_id,
        product_name: req.body.product_name,
        product_category: req.body.product_category,
        brand: req.body.brand,
        customer_name: req.body.customer_name,
        associated_recipe: req.body.associated_recipe,
        pricing: req.body.pricing
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
router.post('/update-productmaterial/:id', function (req, res) {
    const id = req.params.id;
    const { product_id, product_name, product_category, brand,customer_name,associated_recipe,pricing  } = req.body;

    ProductMaterial.findByIdAndUpdate(id, { product_id, product_name, product_category, brand,customer_name,associated_recipe,pricing}, function (err, rawmaterail) {
        if (err) {
            console.log('Error in updating task', err);
            return res.redirect('back');
        }

        return res.redirect('/productmaterial');
    });
});


// Deleting Tasks
router.get('/delete-productmaterial', function (req, res) {
    const productMaterialIds = req.query.productMaterialId;
    // Convert rawMaterialIds to an array if it's not already
    const productMaterialIdsArray = Array.isArray(productMaterialIds) ? productMaterialIds : [productMaterialIds];

    productMaterialIdsArray.forEach(productMaterialId => {
        ProductMaterial.findByIdAndDelete(productMaterialId, function (err) {
            if (err) {
                console.log('Error in deleting Product material', err);
            }
        });
    });

    return res.redirect('back');
});
module.exports = router;

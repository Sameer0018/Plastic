const express = require('express');
const router = express.Router();

// import models and other required dependencies
const Task = require('../models/task');
const RawMaterial = require('../models/rawMaterial');
const Raw = require('../models/rawmodel');
// rendering the App Page
router.get('/', function (req, res) {
    Task.find({}, function (err, tasks) {
        if (err) {
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('todotask', {
            title: "Recipe Creation",
            tasks: tasks
        });
    });
});
router.get('/todotask', async (req, res) => {
  try {
    const tasks = await Task.find().populate('rawMaterial');
    const rawMaterials = await RawMaterial.find();
    res.render('todotask', { title: 'Recipe Raw', tasks, rawMaterials,  req  });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Creating Tasks
router.post('/create-task', async (req, res) => {
  try {
    const {
      description,
      Brand,
      customer_name,
      quantities,
      rawMaterialIds,
    } = req.body;
    
    // Fetch the raw materials based on the selected IDs
    const rawMaterials = await RawMaterial.find({ _id: { $in: rawMaterialIds } });
    let totalCost = 0;
    const nonEmptyQuantities = quantities.filter(quantity => quantity !== ''); // Remove empty strings
    
    rawMaterials.forEach((rawMaterial, index) => {
      console.log('Quantities:', JSON.stringify(nonEmptyQuantities));
      const quantity = nonEmptyQuantities.length > 0 ? parseFloat(nonEmptyQuantities[0]) : 0;
      console.log('quantity', quantity);
      const cost = rawMaterial.current_cost * quantity * (1 + 0.03);
      totalCost += cost;
    });
    
    console.log(totalCost);
    if (rawMaterialIds.length === 0) {
      console.log('No raw materials selected');
      return res.redirect('raw');
    }
    
    const quantityArray = nonEmptyQuantities.map(Number);
    console.log('qa', quantityArray);
    
    const newTask = new Task({
      description,
      Brand,
      customer_name,
      rawMaterial: rawMaterialIds,
      quantities: quantityArray,
      inventory_level: req.body.inventory_level,
      Price: totalCost,
    });
    
    await newTask.save();
    
    return res.redirect('raw');
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Updating Tasks
router.post('/todotask/update-task/:id', function (req, res) {
  const id = req.params.id;
  const { description, Brand, customer_name, rawMaterialIds, quantities } = req.body;
  console.log('Request Body:', req.body);

  // Fetch the raw materials based on the rawMaterialIds
  RawMaterial.find({ _id: { $in: rawMaterialIds } }, function (err, rawMaterials) {
      if (err) {
          console.log('Error in fetching raw materials', err);
          return res.redirect('back');
      }
      console.log('Raw Materials:', rawMaterials);

      let Price = 0;

      rawMaterials.forEach((rawMaterial, index) => {
          Price += rawMaterial.current_cost * quantities[index] * (1 + 0.03);
      });

      Task.findByIdAndUpdate(id, { description, Brand, customer_name, Price, rawMaterialIds, quantities }, function (err, task) {
          if (err) {
              console.log('Error in updating task', err);
              return res.redirect('back');
          }

          return res.redirect('/todotask');
      });
  });
});

// Deleting Tasks
router.get('/delete-task', function (req, res) {
    const taskIds = req.query.taskId;

    // Convert taskIds to an array if it's not already
    const taskIdsArray = Array.isArray(taskIds) ? taskIds : [taskIds];

    taskIdsArray.forEach(taskId => {
        Task.findByIdAndDelete(taskId, function (err) {
            if (err) {
                console.log('Error in deleting task', err);
            }
        });
    });

    return res.redirect('back');
});
module.exports = router;

const mongoose = require('mongoose');
const Task = require('./task');

const rawMaterialSchema = new mongoose.Schema({
  Material: {
    type: String,
    required: true
  },
  Materialname: {
    type: String,
    required: true,
    unique: true
  },
  Materialtype: {
    type: String,
    required: true
  },
  current_cost: {
    type: Number,
    required: true
  },
  vendor_information: {
    type: String,
    required: true
  },
  inventory_level: {
    type: String,
    required: true
  },
});

// Pre-save middleware to update related tasks
rawMaterialSchema.post('findOneAndUpdate', async function () {
  // Access the updated document
  const updatedRawMaterial = await this.model.findOne(this.getQuery());

  // Extract the updated current_cost
  const updatedCurrentCost = updatedRawMaterial.current_cost;

  // Find all tasks with the same category as the updated raw material
  const tasksToUpdate = await Task.find({ rawMaterial: updatedRawMaterial._id });

  // Iterate over the tasks and update the Price
  for (const task of tasksToUpdate) {
    // Calculate the updated Price based on the new current_cost
    const updatedPrice = updatedCurrentCost * task.Quantity * (1 + 0.03);

    // Update the task's Price field
    task.Price = updatedPrice;
    await task.save();
  }
});


const RawMaterial =mongoose.model('RawMaterial', rawMaterialSchema);
module.exports = RawMaterial
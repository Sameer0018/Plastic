// require the library
const mongoose = require('mongoose');

// creating Schema for Tasks
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },

    Price: {
        type: Number,
        default: function() {
            

        }
    },

 quantities:[{
  type:Number,
  required:true
 }],
   
    rawMaterial:[   {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'RawMaterial'
        }],
      
 
      total_cost: {
    type: Number,
    default: 0
  }
   });

const Task = mongoose.model('Task', taskSchema);

// exporting the Schema
module.exports = Task;


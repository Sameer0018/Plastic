const mongoose = require('mongoose');
// Define the schema for the Raw model
const rawSchema = new mongoose.Schema({
  name: String,
  raw_brand: String,
  Price: {
        type: Number,
        default: function() {
            

        }
    },
  rawMaterial:[   {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RawMaterial'
  }],
  task:[   {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
});
// Create the Raw model using the schema
const Raw = mongoose.model('Raw', rawSchema);

// Export the Raw model
module.exports = Raw;

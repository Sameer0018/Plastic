// require express for setting up the express server
const express = require('express');

// set up the port number
const port = 7000;

// importing the DataBase
const db = require('./config/mongoose');

// set up the view engine
const app = express();

// using static files
app.use(express.static("./views"));

// to use encrypted data
app.use(express.urlencoded());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Importing route files

const taskRoutes = require('./routes/tasksRoutes')
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const productMaterialRoutes = require('./routes/productMaterialRoutes');
const rawRoutes =require('./routes/rawRoutes');
// Using route files
app.use('/', taskRoutes);
app.use('/rawmaterial', rawMaterialRoutes);
 app.use('/productmaterial', productMaterialRoutes);
 app.use('/raw',rawRoutes);
 const readexcelfile = require('read-excel-file/node');
const MongoClient = require('mongodb').MongoClient;

app.get('/', async (req, res) => {
    const tasks = await Task.find().populate('rawmaterials_id');
    res.render('index', { title: 'Recipe List', tasks: tasks });
});

// Connection URL
const url = 'mongodb://localhost:27017/';

// Database Name
const dbName = 'todos';

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to the MongoDB server
client.connect(function(err) {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }

  console.log('Connected successfully to the database');

  // Get the reference to the database
  const db = client.db(dbName);

  // Retrieve the values of current_cost based on Materialname
  db.collection('rawmaterials').aggregate([
    {
      $project: {
        _id: 0,
        Materialname: 1,
        current_cost: 1
      }
    }
  ]).toArray(function(err, result) {
    if (err) {
      console.error('Aggregate error:', err);
      return;
    }

    // console.log('Result:', result);

    // Close the database connection
    client.close();
  });
});
// Set up the middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const Task = require('./models/task');
const Raw = require('./models/rawmodel');
// make the app to listen on assigned port number
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});

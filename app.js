const express = require("express");
// importing mongoose
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://omotuwaojo:omotuwa00@cluster0.oqsx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const mongoose = require('mongoose');
const Products = require('./models/products');
const port = 3000;
const app = express();

//importing data from another file
const users = require('./datas/UserData');
const products = require('./datas/ProductData');

// working on Post request
// Middleware to pasre json data 
app.use(express.json());
const data = [];

// mongoose Url
// const dbUrl = "mongodb+srv://omotuwaojo:omotuwa00@cluster0.oqsx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Connect to Mongodb
// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

//   .then(() => console.log('Connected to MongoDB'))
//   .catch(error => console.error('Could not connect to MongoDB', error));




app.get("/", (request, response) => {
  response.send("Welcome to Server");
})


app.get("/api/users", (req, res) => {
  res.send(users);
})

app.get("/api/products", (req, res) => {
  res.send(products);
})


// // post request to get single user
// app.post("/sign-up",(req, res) => {
//     const user ={
//         id: data.length + 1,
//         name: req.body.name,
//         password: req.body.password
//     };
//     data.push(user);
//     res.status(201).json(user);
//     console.log(user)
// })

// post request to get mutipule users 
app.post("/sign-up", (req, res) => {
  const users = req.body;
  users.forEach((user) => {
    const newUser = {
      id: data.length + 1,
      name: user.name,
      password: user.password,
    };
    data.push(newUser);
  });
  res.status(201).json(data);
  console.log(users)
});


// insertData in the database
/*
// function insertData(){
//   Products.insertMany([
//     {
//       name: "New Balance 574 Sneakers",
//       description: "Classic and comfortable sneakers for everyday wear",
//       price: 99.99,
//       category: "Shoes",
//     }
//   ])
// }
// insertData(); */

async function main() {
  try {
      await client.connect();
      console.log("Connected to MongoDB!");

      const database = client.db("ecommerce");
      const collection = database.collection("products");

      // Insert the productsData
      const result = await collection.insertMany(products);
      console.log(`${result.insertedCount} products inserted!`);
  } catch (error) {
      console.error("Error inserting data:", error);
  } finally {
      await client.close();
  }
}

main().catch(console.error);





//default app listening port
app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
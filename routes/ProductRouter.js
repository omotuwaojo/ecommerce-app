const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://omotuwaojo:omotuwa00@cluster0.oqsx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Products = require("../models/products");

// getting all product  from the database

// Fetch all products from the database
router.get("/api/db/products", async (req, res) => {
  try {
    await client.connect(); // Connect to MongoDB
    const database = client.db("ecommerce");
    const collection = database.collection("products");

    const products = await collection.find().toArray(); // Fetch products
    res.status(200).json(products); // Return the products as JSON
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  } finally {
    await client.close(); // Ensure the connection is closed
  }
});

// router.get("/api/db/products", async (req, res) => {
//     try {
//         console.log("Fetching products...");

//         const products = await Products.find(); // Fetch products from the database

//         console.log("Fetched products:", products); // Log fetched products for debugging

//         res.json(products); // Send the products as JSON response
//     } catch (error) {
//         console.error("Error fetching products:", error); // Log the error
//         res.status(500).send("Server error");
//     }
// });

/// Route to get a product by its ID
router.get("/api/db/products/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from the URL parameter

    await client.connect(); // Connect to MongoDB
    const database = client.db("ecommerce");
    const collection = database.collection("products");

    // Find the product by ID
    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" }); // Handle if product doesn't exist
    }

    res.status(200).json(product); // Return the product as JSON
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).send("Server error");
  } finally {
    await client.close(); // Ensure the connection is closed
  }
});

// Route to update a product by ID
router.put("/api/db/products/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL
    const updateData = req.body; // Data to update, sent in the request body

    await client.connect(); // Connect to MongoDB
    const database = client.db("ecommerce");
    const collection = database.collection("products");

    // Check if the ID is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Update the product by ID
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Match the product by ID
      { $set: updateData } // Update fields specified in the request body
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" }); // If no product is found
    }

    res.status(200).json({ message: "Product updated successfully", result });
  } catch (error) {
    console.error("Error updating product by ID:", error);
    res.status(500).send("Server error");
  } finally {
    await client.close(); // Ensure the connection is closed
  }
});

module.exports = router;

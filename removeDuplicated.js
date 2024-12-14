const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://omotuwaojo:omotuwa00@cluster0.oqsx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function removeDuplicates() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("ecommerce");
    const collection = database.collection("products");

    // Step 1: Identify duplicates based on the 'name' field
    const duplicates = await collection
      .aggregate([
        {
          $group: {
            _id: { name: "$name" }, // Group by 'name'
            ids: { $push: "$_id" }, // Collect all _id values for duplicates
            count: { $sum: 1 }, // Count occurrences
          },
        },
        {
          $match: {
            count: { $gt: 1 }, // Only consider groups with more than one document
          },
        },
      ])
      .toArray();

    // Step 2: Remove duplicates, keeping only one
    for (const duplicate of duplicates) {
      const ids = duplicate.ids;
      ids.shift(); // Remove the first _id (keep one document)

      // Delete all other documents with the same 'name'
      await collection.deleteMany({ _id: { $in: ids } });
    }

    console.log("Duplicates removed successfully");
  } catch (error) {
    console.error("Error removing duplicates:", error);
  } finally {
    await client.close();
  }
}

removeDuplicates(); // to removeDuplicated data 

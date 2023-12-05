const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "<mongodb+srv://priya_vuenode:priya@123@cluster0.stm9eqz.mongodb.net/>";



const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('FoodItems');
    const Recipes = database.collection('Recipes');

    console.log(Recipes);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
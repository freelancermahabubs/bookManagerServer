const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.mzwsigq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const bookCollection = client.db("bookManager").collection("books");

    // first work
    // insert a book to db

    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await bookCollection.insertOne(data);
      res.send(result);
    });

    app.get("/all-books", async (req, res) => {
      const q = req.query;
      console.log(q);
      const books = bookCollection.find();
      const result = await books.toArray();
      res.send(result);
    });

    // update Data
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          ...updatedBookData,
        },
      };
      const result = await bookCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// app.get("/", (req, res) => {
//   res.send("BookManagement Server is Running");
// });
app.listen(port, () => {
  console.log(`Listening to Port on: ${port}`);
});

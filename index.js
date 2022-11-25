const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kusbv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const userCollection = client.db("Assignment12").collection("users");
  const productCollection = client.db("Assignment12").collection("products");
  const advertiseCollection = client.db("Assignment12").collection("advertise");

  
  try {

    //find a seller's all Product
    app.get("/dashboard/myProducts/:email", async (req, res) => {
      const email = req.params.email;
      console.log('email')
      const query = { SellerEmail :email};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //find all ProductCategories
    app.get("/ProductCategories", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //insert userinfo into the database
    app.post("/storeUser", async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo);
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });

    //find user
    app.get("/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = {
        email: email,
      };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    //insert productinfo into the database
    app.post("/addAProduct", async (req, res) => {
      const productInfo = req.body;
      // console.log(productInfo);
      const result = await productCollection.insertOne(productInfo);
      res.send(result);
    });

        //find all Product under a Categories
        app.get("/category/:id", async (req, res) => {
          const id = req.params.id;
          const query = {ProductCategory: id};
          const cursor = productCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        });

        // app.patch("/akash", async (req, res) => {
        //   const filter = { ProductName: 'Redmi note 9' };
        //   const options = { upsert: true };
        //   const updateDoc = {
        //     $set: {
        //       SalesStatus: `Available`
        //     },
        //   };
        //   const result = await productCollection.updateOne(filter, updateDoc, options);
        //   res.send(result);
        // });
      
      //insert advertise productinfo into the database
     app.post("/advertise", async (req, res) => {
      const productInfo = req.body;
      // console.log(productInfo);
      const result = await advertiseCollection.insertOne(productInfo);
      res.send(result);
    });

    //delete product
    app.delete("/advertise/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
    const query = {
      _id: ObjectId(id)
    };
    const result = await productCollection.deleteOne(query);
    res.send(result);
    });

     //find all advertise Product
     app.get("/advertiseItems", async (req, res) => {
     
      const query = { };
      const cursor = advertiseCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } catch {
    console.log("server error");
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("api found");
});
app.listen(port, () => {
  console.log("server running");
});

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
  const bookingCollection = client.db("Assignment12").collection("booking");
  const reportCollection = client.db("Assignment12").collection("report");
  
  try {

      //find id booking Product
      app.get("/myOrders/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: ObjectId(id) };
        const result = await bookingCollection.findOne(query);
        res.send(result);
      });

    //find all advertise Product
    app.get("/advertiseItems", async (req, res) => {
      const query = { };
      const cursor = advertiseCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

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

     //find all user
     app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

     //find all report
     app.get("/report", async (req, res) => {
      const query = {};
      const cursor = reportCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //insert userinfo into the database
    app.post("/storeUser", async (req, res) => {
      const userInfo = req.body;
      // console.log(userInfo);
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });

     //insert report into the database
     app.post("/report", async (req, res) => {
      const reportInfo = req.body;
      console.log(reportInfo);
      const result = await reportCollection.insertOne(reportInfo);
      res.send(result);
    });

     //insert bookinginfo into the database
     app.post("/booking", async (req, res) => {
      const bookingInfo = req.body;
      console.log(bookingInfo);
      const result = await bookingCollection.insertOne(bookingInfo);
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

       //find all booking Product
       app.get("/myOrders/:email", async (req, res) => {
        const email = req.params.email;
        // console.log(email)
        const query = {BuyerEmail: email};
        const cursor = bookingCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });
      

        // app.patch("/akash/:email", async (req, res) => {
        //   const email = req.params.email;
        //   const filter = { email: email };
        //   const options = { upsert: true };
        //   const updateDoc = {
        //     $set: {
        //       SellerVerify: false
        //     },
        //   };
        //   const result = await userCollection.updateOne(filter, updateDoc, options);
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

    //delete user
    app.delete("/deleteUser/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email)
    const query = {
      email: email
    };
    const result = await userCollection.deleteOne(query);
    res.send(result);
    });
   

    //delete report product
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
    const query1 = {
      _id: id
    };
    const result = await reportCollection.deleteOne(query1);

    const query2 = {
      _id: ObjectId(id)
    };
    const result1 = await productCollection.deleteOne(query2);
    
    const query3 = {
      _id: id
    };
    const result2 = await advertiseCollection.deleteOne(query3);

    res.send(result);
    });



     //verify user
     app.patch("/verifyUser/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
    const query = {
      email: email
    };
    const updateDoc = {
      $set: {
        SellerVerify: true
      },
    };

    const updateDoc1 = {
      $set: {
        verify: true
      },
    };
    const result = await userCollection.updateOne(query,updateDoc1);

    const filter = { SellerEmail: email };
    const result1 = await productCollection.updateMany(filter,updateDoc);
    const result2 = await advertiseCollection.updateMany(filter,updateDoc);
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

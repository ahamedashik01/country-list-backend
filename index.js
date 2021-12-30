const { MongoClient } = require('mongodb');
const express = require('express');
var cors = require('cors');
require('dotenv').config();

const ObjcetId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5cdlp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// client 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('client connected');

        const database = client.db('countries');
        //countries DATA 
        const countriesCollection = database.collection('countries');
        const usersCollection = database.collection('users');


        //countries METHOD 

        //GET 
        app.get('/countries', async (req, res) => {
            const cursor = countriesCollection.find({});
            const countries = await cursor.toArray();
            res.send(countries);
        });
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        app.get('/countries/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjcetId(id) };
            const countries = await countriesCollection.findOne(query);
            res.json(countries);
        })

        //POST 
        app.post('/countries', async (req, res) => {
            const country = req.body;
            const result = await countriesCollection.insertOne(country);
            res.json(result);
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        //PUT
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        // app.put('/countries/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const country = req.body;
        //     // console.log(countries);
        //     const filter = { _id: ObjcetId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             status: "Approved"
        //         }
        //     };
        //     const result = await countriesCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        // })

        //DELETE 
        app.delete('/countries/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjcetId(id) }
            const result = await countriesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ROOT OF COUNTRY-LIST SERVER')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
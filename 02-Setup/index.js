import { Redis } from 'ioredis';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

const client = new Redis('redis://localhost:6379');

app.get('/redis', async (req, res) => {
    const reply = await client.ping();
    res.json({message: reply});
});

app.get('/mongo', async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        res.json({message: "Connected to MongoDB"});
    } catch (error) {
        res.json({message: "Error connecting to MongoDB", error: error.message});
    }
});

app.listen(8000, ()=>{
    console.log("Server is running on port 8000");
})
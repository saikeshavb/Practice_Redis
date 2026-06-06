import { Redis } from 'ioredis';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Redis('redis://localhost:6379');

const bannerKey = "app:banner";

app.post('/banner', async (req, res) => {
    await client.set(bannerKey, req.body.message || "Welcome to our website!");
    res.json({message: "Banner set"});
});

app.get('/banner', async (req, res) => {
    const banner = await client.get(bannerKey);
    res.json({banner});
});

app.delete('/banner', async (req, res) => {
    await client.del(bannerKey);
    res.json({message: "Banner deleted"});
});

app.listen(8000, ()=>{
    console.log("Server is running on port 8000");
})


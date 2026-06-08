import {Redis} from 'ioredis';
import express from 'express';

const app = express();

app.use(express.json());

const client = new Redis('redis://localhost:6379');

app.post('/user/:id/json', async(req,res)=>{
    await client.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({message: 'json'});
})

app.get('/user/:id/json', async(req,res)=>{
    const data = await client.get(`user:${req.params.id}:json`);
    res.json({data: JSON.parse(data)});
})

app.post('/user/:id/hash', async(req,res)=>{
    await client.hset(`user:${req.params.id}:hash`, req.body);
    res.json({message: 'hash'});
})

app.get('/user/:id/hash', async(req,res)=>{
    const data = await client.hgetall(`user:${req.params.id}:hash`);
    res.json({data});
})

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})

// this is just to understand that if we are using json
// Key difference
// String stores one text blob (user:123:json-> "{\"name\":\"keshav\",\"age\":\"30\",\"phone\":\"323232\"}").
// Hash stores structured fields inside the key.user:123:hash
//   -> name  : "keshav"
//   -> age   : "30"
//   -> phone : "323232"
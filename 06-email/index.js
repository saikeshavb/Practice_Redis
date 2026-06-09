import {Redis} from 'ioredis';
import express from 'express';

const app = express();

app.use(express.json());

const client = new Redis('redis://localhost:6379');

const Queue_Key = "queue:emails";
app.post('/email', async(req,res)=>{
    const job= {
        to: req.body.to,
        subject: req.body.subject || 'No Subject',
        body: req.body.body || 'No Content',
        createdAt: new Date().toISOString()
    }
    await client.lpush(Queue_Key, JSON.stringify(job));
    res.json({message: 'Email queued successfully'});
});

app.get('/email/length' , async(req,res)=>{
    const length = await client.llen(Queue_Key);
    res.json({length});
}) 

app.get('/email/process', async(req,res)=>{
    const rawJob = await client.rpop(Queue_Key);
    if(!rawJob){
        res.json({message: 'No emails to process'});
    } else {
        const emailData = JSON.parse(rawJob);
        res.json(JSON.parse(rawJob));
    }
});

app.listen('8000',()=>{
    console.log('Server is running on port 8000');
})
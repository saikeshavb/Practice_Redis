import {Redis} from 'ioredis';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const client = new Redis('redis://localhost:6379');

app.post('/otp', async (req,res)=>{
    const {phone} = req.body;
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await client.set(phone, otp, "EX", 60); // Set the OTP with an expiration time of 60 seconds
    res.json({message: 'OTP sent successfully', otp});
})

app.post('/otp/verify', async (req,res)=>{
    const {phone, otp} = req.body;
    const storedOtp = await client.get(phone);
    if(storedOtp === otp){
        await client.del(phone);
        res.json({message: 'OTP verified successfully'});
    }else{
        res.status(400).json({message: 'Invalid OTP'});
    }
    // res.json({storedOtp, otp});
});

app.get('/exists/:phone', async (req,res)=>{
    const {phone} = req.params;
    const exists = await client.exists(phone);
    res.json({exists: exists === 1});
});

app.get('/ttl/:phone', async (req,res)=>{
    const {phone} = req.params;
    const ttl = await client.ttl(phone);
    res.json({ttl});
});

app.listen(8000,()=>{
    console.log('Server is running on port 8000');
})
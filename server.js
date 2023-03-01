const express = require ("express");

const app = express();

const port = 443;

const bodyParser = require ('body-parser');

const Redis = require ('redis');

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid');

const https = require ('https');

const fs = require('fs');

app.use(bodyParser.json()) ;     
                                      //Looks for incoming data
app.use(express.static("public"));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(async function (req, res, next){
    var cookie = req.cookies.stedicookie;
    if(cookie === undefined && !req.url.includes('login')) {
        res.status(401);
        res.send("no cookie");
    }
    else {
        res.status(200);
        next();
    }
});

app.post('/rapidsteptest',async (req, res) =>{
    const steps = req.body;
    await redisClient.zAdd('Steps',[{score:0,value:JSON.stringify(steps)}]);
    console.log('Steps',steps);
    res.send('saved');
});

app.get ("/", (req, res) => {
    res.send("Hello Alison");
});

app.get("/validate", async(req, res) => {
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
});

app.post('/login', async(req, res) =>{                                       //Allows us to send data          /login tells you what page it is
    const loginUser = req.body.userName;    
    const loginPassword = req.body.password;
    console.log('Login username: '+loginUser);
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword==correctPassword){                            //
        const loginToken = uuidv4();
        await redisClient.hSet('TokenMap', loginToken, loginUser);
        res.cookie('stedicookie', loginToken);
        res.send(loginToken);
    } else {
        res.status(401);
        res.send('Incorrect password for '+loginUser);
    }                                      
});

// app.listen(port, () => {
   //  redisClient.connect();
   // console.log("listening")
// });


https.createServer(
    {key: fs.readFileSync('/etc/letsencrypt/live/for17015@alisonforsberg.cit270.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/for17015@alisonforsberg.cit270.com/pem'),
    ca:fs.readFileSync('/etc/letsencrypt/live/for17015@alisonforsberg.cit270.com/fullchain.pem')
},
app
).listen(port, ()=>{
    redisClient.connect();
    console.log('Listening on port: '+port);
})
const express = require ("express");

const app = express();

const port = 3000;

const bodyParser = require ('body-parser');

const {v4: uuidv4} = require('uuid');

app.use(bodyParser.json()) ;                                           //Looks for incoming data

app.get ("/", (req, res) => {
    res.send("Hello Alison");
});

app.post('/login', (req, res) =>{                                       //Allows us to send data          /login tells you what page it is
    const loginUser = req.body.userName;    
    const loginPassword = req.body.password;
    console.log('Login username: '+loginUser);
    if (loginUser=="yahoo@gmail.com" && loginPassword=="P@ssw0rd"){                            //
        const loginToken = uuidv4();
        res.send(loginToken);
    } else {
        res.status(401);
        res.send('Incorrect password for '+loginUser);
    }                                      
});

app.listen(port, () => {
    console.log("listening")
});
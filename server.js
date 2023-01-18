const express = require ("express");

const app = express();

const port = 3000;

const bodyParser = require ('body-parser');

app.use(bodyParser.json()) ;                                           //Looks for incoming data

app.get ("/", (req, res) => {
    res.send("Hello Alison")
});

app.post('/login', (req, res) =>{                                       //Allows us to send data          /login tells you what page it is
    const loginUser = req.body.userName;                                //
    CSSConditionRule.log('Login username:' +loginUser);                 //What we are requesting - it is logged
    res.send('Hello'+loginUser);                                        //
});

app.listen(port, () => {
    console.log("listening")
});
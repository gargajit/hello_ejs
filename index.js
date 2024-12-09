import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import session from "express-session";
import * as RedisStore from "connect-redis";
import { createClient } from "redis";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Create a Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

// body parser middleware
app.use(bodyParser.urlencoded( { extended: true }));

// Static Middleware
app.use(express.static("public"));

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: "hard1coded1bad1key1for1example123",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, //1 day
        },
    })
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


app.post("/home", (req, res) => {
    const date = new Date();
    const today = date.getDay();

    let type = "a weekday";
    let adv = "it's time to work hard.";

    if (today === 0 || today === 6) {
        type = "the weekend";
        adv = "it's time to have fun.";
    }
    req.session.userData = {
        name: req.body["name"],
        dayType: type,
        advice: adv,
    }
    res.render("home.ejs", req.session.userData);
});

app.get("/home", (req, res) => {
    if(req.session.userData) {
        res.render("home.ejs", req.session.userData);
    } else {
        res.render("/"); // Redirect to the form if no session data exists
    }
});

app.get("/ejs", (req, res) => {
    res.render("ejs.ejs", 
        {
            name: "John Doe",
            html: "<b>Hello World</b>",
        }
    );
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`); 
});

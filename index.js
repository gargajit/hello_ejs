import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// body parser middleware
app.use(bodyParser.urlencoded( { extended: true }));

// Static Middleware
app.use(express.static("public"));


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
    res.render("home.ejs", 
        { 
            name: req.body["name"],
            dayType: type,
            advice: adv,
        }
    );
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`); 
});

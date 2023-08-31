import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 3000;

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded( {extended: true} ));


let translatedText = "";
app.post("/translate", async (req, res) => {
    const sourceLanguage = req.body.sourceLanguage;
    const targetLanguage = req.body.targetLanguage;
    const userText = req.body.userText;

    const encodedParams = new URLSearchParams();
    encodedParams.set('source_language', `${sourceLanguage}`);
    encodedParams.set('target_language', `${targetLanguage}`);
    encodedParams.set('text', `${userText}`);

    const options = {
        method: 'POST',
        url: 'https://text-translator2.p.rapidapi.com/translate',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': `${API_KEY}`,
          'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        data: encodedParams,
    };

    try {
        const requestTranslation = await axios.request(options);
        let result = requestTranslation.data["data"].translatedText;
        translatedText = result;

        res.redirect("/");
    } 
    catch(error) {
        console.log(error);
    }
    console.log(req.body);
})


// Fetching all the available languages coming from api
app.get("/", async (req, res) => {
    try {
        const languagesRequest = await axios.get(API_URL+"/getLanguages", {
            headers: {
                'X-RapidAPI-Key': `${API_KEY}`,
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            }
        });
        const result = languagesRequest["data"].data;
        const availLang = result.languages;
        res.render("main.ejs", {
            availLang: availLang,
            text: translatedText,
        });
    }
    catch(error) {
        console.log(error);
    }
}) 
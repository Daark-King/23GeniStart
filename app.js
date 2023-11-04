const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const streamToBuffer = require('stream-to-buffer');
// var open = require("open");

const openai = new OpenAI({
    apiKey: "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",
});
  
import("node-fetch").then((nodeFetch) => {
    const fetch = nodeFetch.default;
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.get("/", (req, res) => {
    res.sendFile("/public/index2.html", { root: __dirname });
});

app.post("/logo",(req,res) => {

    var company = req.body.CompanyName;
    var product = req.body.ProductDetails;

    const fetchTextToImage = async (company,product) => {
        const url = 'https://open-ai21.p.rapidapi.com/texttoimage2';
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'b15912910emsh5e91346d18e1dbep1ae0fejsne917d34536d5',
            'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
          },
          body: new URLSearchParams({ text: "Generate unique and appealing logo concepts for a company that specializes in "+company+" and offers "+product+". The logo should reflect the company's identity and the products it deals with."
          })
        };
      
        try {
          const response = await fetch(url, options);
          const result = await response.text();

          const resultObject = JSON.parse(result);

          const imageUrl = resultObject.url;

          res.send(imageUrl);
        } catch (error) {
          console.error(error);
        }
    };
    
    fetchTextToImage(company,product);

});

app.post("/advertise", (req, res) => {
       
    var advertise = req.body.advertiseProduct;

    const fun = async (data) => {
        const prompt =
            "The text provided is related to the services/products of a company. Based on the given input give me the possible advertisement strategies for the company to start well in the particular industry.";
        
        const userInput = data;
        
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt + "\n" + userInput }],
            max_tokens: 700,
        });
        
        var data = chatCompletion.choices[0].message.content;

        res.send(data);
    };

    fun(advertise);
});



app.listen(3000, () => {
    console.log("Server started running on port 3000");
});
  
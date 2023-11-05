const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const streamToBuffer = require('stream-to-buffer');
const { PDFDocument } = require('pdf-lib');
const { readFile, writeFile } = require('fs').promises;
const axios = require('axios');
// var open = require("open");

const openai = new OpenAI({
    apiKey: "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",
});
  
import("node-fetch").then((nodeFetch) => {
    const fetch = nodeFetch.default;
});

mongoose.connect("mongodb://localhost:27017/SIHDB", {});

const imageUrlSchema = new mongoose.Schema({
    url: String,
});

const ImageUrl = mongoose.model('ImageUrl', imageUrlSchema);

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
            'X-RapidAPI-Key': 'c227578f59msh383e536786f97dcp153cebjsnf77e8f539ebd',
            'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
          },
          body: new URLSearchParams({ text: "Generate unique and appealing logo concepts for a company that specializes in "+company+" and offers "+product+". The logo should reflect the company's identity and the products it deals with."
          })
        };
      
        try {
          const response = await fetch(url, options);
          const result = await response.text();

          const resultObject = JSON.parse(result);

          const imgurl = resultObject.url;

          res.send(imgurl);

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

app.post("/compete",(req,res) => {
    const product = req.body.pr;

    async function fetchData(product) {
        const url = `https://google-maps-data1.p.rapidapi.com/gmaps?keyword=${product}&latitude=12.9300783&longitude=77.5275351&maxResults=5&zoom=15`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'c227578f59msh383e536786f97dcp153cebjsnf77e8f539ebd',
            'X-RapidAPI-Host': 'google-maps-data1.p.rapidapi.com'
          }
        };
      
        try {
          const response = await fetch(url, options);
          const data = await response.json();

          const items = data.result;
      
          items.forEach(function(item) {
              res.write(`Title : ${item.title}, Contact : ${item.contact.phone}, Description : ${item.description}, Url : ${item.images.thumbnail}`+"\n");
          })

          res.end();
        } catch (error) {
          console.error(error);
        }
    }
      
    fetchData(product);
})

app.post("/nda",(req,res)=>{
    res.sendFile("/public/nda.html", { root: __dirname });
});

app.post("/fill3",(req,res)=>{
    const name1 = req.body.name1;
    const name2 = req.body.name2;
    const name3 = req.body.name3;
    const name4 = req.body.name4;
    const name5 = req.body.name5;
    const name6 = req.body.name6;
    const name7 = req.body.name7;
  
    async function createPdf(input, output, data) {
      try {
        const pdfDoc = await PDFDocument.load(await readFile(input));
        const form = pdfDoc.getForm();
        const nf = 7;
      
        for (let i = 1; i <= nf; i++) {
          form.getTextField(i.toString()).setText(data['name' + i]);
        }
  
        const pdfBytes = await pdfDoc.save();
    
        await writeFile(output, pdfBytes);
        console.log('PDF created!');
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  
    try {
      const outputPdfBuffer = createPdf('NDA.pdf', 'output3.pdf', {
        name1,
        name2,
        name3,
        name4,
        name5,
        name6,
        name7,
      });
  
      res.status(200).send('PDF created successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('PDF creation failed');
    }
  
});

app.get("/download3",(req,res)=>{
    const filePath = path.join(__dirname, '/', 'output3.pdf');
    res.download(filePath, (err) => {
      if (err) {
        // Handle errors, such as file not found
        console.error(`Error downloading the file: ${err.message}`);
        res.status(404).send('File not found');
      } else {
        console.log('File downloaded successfully');
      }
    });
});


app.listen(3000, () => {
    console.log("Server started running on port 3000");
});
  
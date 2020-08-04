const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");         // This is for POST METHOD 
app.use(bodyParser.urlencoded({extended: true}));  // This is for POST METHOD 

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// FUNCTION for creating 6 random alphanumeric characters
function generateRandomString() {
    let result = '';
    let str = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
      for(let i = 0; i < 6; i++){
        result += str.charAt(Math.floor(Math.random() * str.length))
  }
  return result;
  }

/* Without this for POST, after submitting we wll have 404 */
app.post("/urls", (req, res) => {
    const newKey = generateRandomString();
    urlDatabase[newKey] = req.body.longURL; //! Adding a pair of key - value to our object!!
    res.redirect(`/urls/${newKey}`);        //! Redirecting to our just generated shortURL page
  });

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
  });

app.get("/urls", (req, res) => {
    let templateVars = {urls: urlDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] };
    res.render("urls_show", templateVars);
  });

  app.get("/u/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] };
    const longURL = templateVars.longURL
    res.redirect(longURL);
  });

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
  });



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");         // This is for POST METHOD 
const cookieParser = require('cookie-parser');
const { response } = require("express");

app.use(bodyParser.urlencoded({extended: true}));  // This is for POST METHOD 
app.set("view engine", "ejs")
app.use(cookieParser());

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
// ADD a new data (key - value) to our TinyApp
app.post("/urls", (req, res) => {
    const newKey = generateRandomString();
    urlDatabase[newKey] = req.body.longURL; //! Adding a pair of {key - value} to our object!!
    res.redirect(`/urls/${newKey}`);        //! Redirecting to our just generated shortURL page
});

// LOGIN Form 
app.post("/login", (req, res) => {
res.cookie('username', req.body.username); // (name: username, value: req.body.username (our username via login button))
res.redirect(`urls/`);
});

// LOGOUT Form
app.post("/logout", (req, res) => {
res.clearCookie('username', req.body.username) // Clean our cookie! via logout button
res.redirect(`urls/`);
});

app.get("/urls", (req, res) => {
    let templateVars = {
      urls: urlDatabase,
      username: req.cookies["username"]}; //! We took it from --> res.cookie('username', req.body.username);
res.render("urls_index", templateVars); // Now we can use our templateVars in urls_index 

});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]};
res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { 
      shortURL: req.params.shortURL, 
      longURL:urlDatabase[req.params.shortURL],
      username: req.cookies["username"]
     };
res.render("urls_show", templateVars); 
});

// ===== After clicking on shortURL(PATH --> /u/:shortURL) redirecting to usuall WEB-SITE(longURL) ===== \\
app.get("/u/:shortURL", (req, res) => { //:shortURL is dynamic (new all the time)
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL:urlDatabase[req.params.shortURL] 
  };
  const longURL = templateVars.longURL
res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//DELETE our URLs
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]; // Deleting the key from Obj --> deleting whole element
res.redirect("/urls");                  
  })

// EDIT our URLs
app.post("/urls/:shortURL", (req, res) => {
/*
!As we have 2 buttons with POST /urls/:shortURL thet will redirect to different PATH
*/
  if(req.body.longURL){ // this variable from urls/show --> on page /urls is FALSE
  // Changing old longURL (req.body.longURL) to new (using body.longURL from name="longURL" show.ejs)
  const newLong = req.body.longURL; 
    urlDatabase[req.params.shortURL] = newLong;
  res.redirect(`/urls`);
 } 
res.redirect(`/urls/${req.params.shortURL}`);
});


// ============= USELES ============= \\
// app.get("/", (req, res) => {
//   res.send("That is a homepage for TinyApp project!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
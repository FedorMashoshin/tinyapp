const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); // This is for POST METHOD 
const cookieParser = require('cookie-parser');
const {
  response
} = require("express");

app.use(bodyParser.urlencoded({
  extended: true
})); // This is for POST METHOD 
app.set("view engine", "ejs")
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// FUNCTION for creating 6 random alphanumeric characters
function generateRandomString() {
  let result = '';
  let str = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (let i = 0; i < 6; i++) {
    result += str.charAt(Math.floor(Math.random() * str.length))
  }
  return result;
}

/* Without this for POST, after submitting we wll have 404 */
// ADD a new data (key - value) to our TinyApp
app.post("/urls", (req, res) => {
  const newKey = generateRandomString();
  urlDatabase[newKey] = req.body.longURL; //! Adding a pair of {key - value} to our object!!
  res.redirect(`/urls/${newKey}`); //! Redirecting to our just generated shortURL page
});

//REGISTRATION FORM
app.post("/register", (req, res) => {
  const user = req.body; // user = (email: ... ; password: ... ) (We READ info FROM our INPUT)
  /* 
  1 - Checking if our fileds are empty or not (If empty 400 statusCode and refresh our page)
  2 - Checking if we have our email in users[object].email
  */
  for (let newUser in users) {
    let userDetails = users[newUser];
    if (!user.email || !user.password || userDetails.email === user.email) {
      res.statusCode = 400;
      res.render("register", {
        user_id: null
      });
    }
  }
  /*
  If everything is ok --> create new user
  */
  let newUser = {
    id: generateRandomString(),
    email: user.email,
    password: user.password
  };
  users[newUser.id] = newUser; // Our just generated ID now is a NEW USER id --> adding a new user to users object
  res.cookie('user_id', newUser.email);
  res.redirect(`/urls`)
});

// LOGIN Form 
app.post("/login", (req, res) => {
  const user = req.body; // user = (email: ... ; password: ... ) (We READ info FROM our INPUT);
  /*
  Checking if our password and emails are the same as in the users[object]
  */
  for (let newUser in users) {
    let userDetails = users[newUser];
    if (userDetails.email === user.email && userDetails.password === user.password) {
      res.cookie('user_id', user.email);
      res.redirect(`/urls`);
    }
  }
  res.statusCode = 403;
  res.render("login", {
    user_id: null
  });
});

// LOGOUT Form
app.post("/logout", (req, res) => {
  res.clearCookie('user_id') // Clean our cookie! via logout button
  res.redirect(`urls/`);
});


app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"] //! We took it from --> res.cookie('username', newUser.email);
  }; 
  res.render("urls_index", templateVars); // Now we can use our templateVars in urls_index 

});

app.get("/register", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  };
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies["user_id"]
  };
  res.render("urls_show", templateVars);
});

// ===== After clicking on shortURL(PATH --> /u/:shortURL) redirecting to usuall WEB-SITE(longURL) ===== \\
app.get("/u/:shortURL", (req, res) => { //:shortURL is dynamic (new all the time)
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
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
  if (req.body.longURL) { // this variable from urls/show --> on page /urls is FALSE
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
const { getUserByEmail } = require('./helpers');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); // This is for POST METHOD 
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const { response } = require("express");

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}));

app.use(bodyParser.urlencoded({
  extended: true
})); 
app.set("view engine", "ejs")

// =============================== DEFAULT DATA ===================================== \\

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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

/* ======================================== 
    FUNCTION FOR CREATING RANDON STRING
======================================== */
function generateRandomString() {
  let result = '';
  let str = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (let i = 0; i < 6; i++) {
    result += str.charAt(Math.floor(Math.random() * str.length))
  }
return result;
}

/* ===============================================
    FUNCTION for creating an object with our URLS
=============================================== */
function urlsForUser(id) {
  const newObj = {};
  for (key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      newObj[key] = urlDatabase[key];
    }
  }
return newObj;
}
/* ======================================== 
    FUNCTION that returns user by userID
======================================== */ 
function logedInUser(userID) {
  const user = users[userID];
  return user;
}

/* ======================================== 
             /URLS POST
======================================== */ 
app.post("/urls", (req, res) => {
  const newKey = generateRandomString();
  // Adding a pair of {key: value} to our object
  urlDatabase[newKey] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }; 
  res.redirect(`/urls/${newKey}`);
});


/* ======================================== 
             /REGISTER POST
======================================== */
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  // Checking if our email/password fields are empty
  if (!email || !password) {
    res.statusCode = 400;
    res.send('Please, fill up all the fields!');
  return
  }
  // Checking if we have thats user in our database (by email)
  const user = getUserByEmail(email, users);
  if (user) {
    res.statusCode = 400;
    res.send('Sorry, user with that email already eists.');
  return;
  }
  // IF everuthing is fine --> create new user
  const id = generateRandomString();
  const newUser = {
    id,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  users[id] = newUser;
  // Encrypting our user.id (value)
  req.session.user_id = newUser.id;
  res.redirect(`/urls`);
});

/* ======================================== 
              /LOGIN POST 
======================================== */
app.post("/login", (req, res) => {
  // Checking if our email/password fields are empty
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.statusCode = 400;
    res.send('Please, fill up all the fields!');
  return;
  }
  // Checking if we have user in our database
  const user = getUserByEmail(email, users);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.statusCode = 302;
    res.send('Sorry! Your email or password is incorrect!');
  return;
  }
  // Encrypting our user.id (value)
  req.session.user_id = user.id;
  // If we dont have that user
  res.redirect(`/urls`);
});

/* ======================================== 
              /LOGOUT POST 
======================================== */
// Killing our session
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`login/`);
});

/* ======================================== 
               /URLS GET 
======================================== */
app.get("/urls", (req, res) => {
  const id = req.session["user_id"];
  console.log(id)
  // Checking if our user is not in our databse
  if (id === undefined) { 
    res.redirect('/login');
  }
  const user = users[id];
  const urls = urlsForUser(id);
  let templateVars = { urls, user };
  // Now we allowed to use templateVars in urls_index.ejs
  res.render("urls_index", templateVars); 
});


/* ======================================== 
               /REGISTER GET 
======================================== */
app.get("/register", (req, res) => {
  let templateVars = { user: logedInUser(req.session["user_id"]) };
  // Now we allowed to use templateVars in register.ejs
  res.render("register", templateVars);
});

/* ======================================== 
               /LOGIN GET 
======================================== */
app.get("/login", (req, res) => {
  let templateVars = { user: logedInUser(req.session["user_id"]) };
  // Now we allowed to use templateVars in login.ejs
  res.render("login", templateVars);
});

/* ======================================== 
            /URLS/NEW GET 
======================================== */
app.get("/urls/new", (req, res) => {
  // Checking if our user is not in our databse
  if (req.session["user_id"] === undefined) { 
    res.redirect('/login');
  }
  let templateVars = { user: logedInUser(req.session["user_id"]) };
  // Now we allowed to use templateVars in urls_new.ejs
  res.render("urls_new", templateVars);
});

/* ======================================== 
          /URLS/:SHORTURL GET 
======================================== */
app.get("/urls/:shortURL", (req, res) => {
  // Checking if our user is not in our databse
  if (req.session["user_id"] === undefined) {
    res.redirect('/login');
  }
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: logedInUser(req.session["user_id"])
  };
  // Checking if our IDs are equal to show URLs list
  if (req.session["user_id"] === urlDatabase[req.params.shortURL].userID) {
    // Now we allowed to use templateVars in urls_show.ejs
    res.render("urls_show", templateVars);
  } else {
    res.send("You don't have matching URLs here!");
  }
});

/* ======================================== 
          /U/:SHORTURL GET 
======================================== */
//:shortURL is dynamic (new all the time)
app.get("/u/:shortURL", (req, res) => { 
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  const longURL = templateVars.longURL;
  res.redirect(longURL);
});

/* ======================================== 
            DELETING URLs POST
======================================== */
app.post("/urls/:shortURL/delete", (req, res) => {
  // Checking if our ID is equal to ID from database (to delete elements)
  if (req.session["user_id"] === urlDatabase[req.params.shortURL].userID) {
    // Deleting the key from Obj --> deleting whole element
    delete urlDatabase[req.params.shortURL]; 
  }
  res.redirect("/urls");
})

/* ======================================== 
            EDITING URLs POST
======================================== */
app.post("/urls/:shortURL", (req, res) => {
  // If we do have our longURL
  if (req.body.longURL) {
    // Changing old longURL (req.body.longURL) to new.
    const newLong = req.body.longURL;
    urlDatabase[req.params.shortURL].longURL = newLong;
    res.redirect(`/urls`);
  }
  res.redirect(`/urls/${req.params.shortURL}`);
 });


/* ======================================== 
            LISTEN PORT
======================================== */
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


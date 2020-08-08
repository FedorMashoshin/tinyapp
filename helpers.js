/* ========================================
      FUNCTION that returns the whole user object
      with id & email & password, or undefined if does not exist.
======================================== */
const getUserByEmail = (email, database) => {
  const keys = Object.keys(database);
  for (let key of keys) {
    const user = database[key];
    if (user.email === email) {
      return user;
    }
  }
};

/* ========================================
    FUNCTION FOR CREATING RANDON STRING
======================================== */
const generateRandomString = () => {
  let result = '';
  let str = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (let i = 0; i < 6; i++) {
    result += str.charAt(Math.floor(Math.random() * str.length));
  }
  return result;
};

/* ===============================================
    FUNCTION for creating an object with our URLS
=============================================== */
const urlsForUser = (id, database) => {
  const newObj = {};
  for (let key in database) {
    if (database[key].userID === id) {
      newObj[key] = database[key];
    }
  }
  return newObj;
};

/* ========================================
    FUNCTION that returns user by userID
======================================== */
const logedInUser = (userID, database) =>  {
  const user = database[userID];
  return user;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  logedInUser
};
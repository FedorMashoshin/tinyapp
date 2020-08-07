/*
   FUNCTION that returns the whole user object with id & email & password, or undefined if does not exist.
*/
function getUserByEmail(email, database){
    const keys = Object.keys(database)
    for (let key of keys) {
      const user = database[key]
      if (user.email === email) {
        return user;
      }
    }
  }

  // FUNCTION that returns user by userID
function logedInUser(userID, database) {
    const user = database[userID]
    return user;
  }

  module.exports = {getUserByEmail, logedInUser };
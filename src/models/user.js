'use strict'
const bcrypt =require("bcrypt");

module.exports = (sequelize, DataTypes) => { // func 001 def start
      const User = sequelize.define('Users', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        passwordHash: DataTypes.STRING,
        contactNo: DataTypes.STRING
      }, 
      {hooks: {
                  // beforeCreate: user => {
                  //     const salt = bcrypt.genSaltSync();
                  //     user.passwordHash = bcrypt.hashSync(user.passwordHash,salt);
                  //     console.log("Password - " + user.passwordHash)
                  //   }
                    // beforeCreate: async function(user) {
                    //   // const salt = await bcrypt.genSalt(10); //whatever number you want
                    //   user.passwordHash =  await bcrypt.hash(user.password, 10);
                    //   console.log("Password async - " + user.passwordHash)
                    // }
                    beforeCreate:  function(user) {
                      // const salt = await bcrypt.genSalt(10); //whatever number you want
                      console.log("In before insert");
                      user.passwordHash =   bcrypt.hashSync(user.passwordHash, 10);
                      console.log("Password async - " + user.passwordHash)
                    }
              }
      }
  ); // function 001 def ends
  
  User.associate = function(models) {
      // associations can be defined here
      return User;
      };
      

  User.prototype.validPassword = async function(password) {
      return await bcrypt.compare(password, user.passwordHash);
  }
    // User.prototype.validatePassword = (password, user, done) => {
     // bcrypt.compare(password, user.passwordHash, (err, isValid) => {
     //   //error handling
     //   if (err) {
     //     console.error(err);
     //     return done(err);
     //   }
  
        //if password is invalid
    //    if (!isValid) {
     //     return done(null, false, { message: "Incorrect password." });
     //   } else {
     //     return done(null, user);
     //   }
    //  });
   // };
  
    return User;
  };
  

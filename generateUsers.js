var bcrypt = require('bcrypt')
const saltRounds = 10;

bcrypt.hash('Reference@123', saltRounds, function(err, salt) {
  console.log('salt', salt)
})

bcrypt.hash('Reference@123', saltRounds, function(err, salt) {
  console.log('salt', salt)
})

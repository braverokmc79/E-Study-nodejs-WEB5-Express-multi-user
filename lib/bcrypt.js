const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log("hash : ", hash);

    // Load hash from your password DB.
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        // result == true
        console.log("result :", result);
    });

    bcrypt.compare(someOtherPlaintextPassword, hash, function (err, result) {
        // result == false
        console.log("result :", result);
    });
});
// THIS WILL CHECK TO SEE IF TOKEN IS IN HEADER
const jwt = require('jsonwebtoken');
const config = require('config');

// THIS WILL EXPORT THE MIDDLEWARE THAT CHECKS FOR WEBTOKENS
module.exports = (request, response, next) => {

    // GET TOKEN FROM HEADER
    const token = request.header('x-auth-token');

    // Check if No TokeN!
    if (!token) {
        return response.status(401).json({msg: "No Token , Authorization Failure !"});
    } else {

        try {
            // VERIFY TOKEN 
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            request.user = decoded.user;
            next();

            
        } catch(error){
            console.log(error.message);
            return response.status(401).json({msg: "Invalid Token, Authorization Failure"})
        }
    }

}

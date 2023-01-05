const jwt = require("jsonwebtoken");  // importing the jsonwebtoken so as to authenticate and authorize the user.
const userModel = require("../models/userModel");
const mongoose = require('mongoose');



const myFunc = token => {
    return jwt.verify(token, 'Nimap_Infotech', (err, decode) => {
        if (err) {
            return null
        } else {
            return decode
        }
    })
}



// ==> Authentication function for all the books APIs

const authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]  // --> token is picked from the headers section of the request
        if ( !token ) return res.status(401).send( { status: false, msg: "token must be present in request header."} )  // --> if token is not present in the headers

        let decodedToken = myFunc(token)
        if (!decodedToken) return res.status(403).send({ status: false, message: "invalid token" })
        req.decodedToken = decodedToken

        next()  // --> next function is called after successful verification of the token, either another middleware (in case of PUT and DELETE api) or root handler function.
    } catch (err) {
        return res.status(500).send( { status: false, error: err.message} )
    }
}


    

module.exports = { authenticate }  // --> exporting the functions
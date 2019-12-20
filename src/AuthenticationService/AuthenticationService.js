var jwt = require('jsonwebtoken');


const AuthenticationService ={
VerifyToken(req, res, next){
    const token = req.params.token
    console.log(token)
    if (!token) {
        res.status(401).json({ error: { message: "missing token" } })
        return
    }
    jwt.verify(req.params.token, 'sixteenCandles', (error, decodedObject) => {
        if (error) {
            res.status(401).json({ error: { message: "invalid token" } })
            return
        }
        // token is valid, we have the user object
        req.user=decodedObject;
        next()
    })
}
}

module.exports= AuthenticationService
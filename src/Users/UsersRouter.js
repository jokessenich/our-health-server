const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const AuthenticationService = require('../AuthenticationService/AuthenticationService.js')





UsersRouter
    .route('/verify/:token')
    .get((req, res, next) => {
        const token = req.params.token
        if (!token) {
            res.status(401).json(false)
            return
        }
        jwt.verify(req.params.token, 'sixteenCandles', (error, decodedObject) => {
            if (error) {
                res.status(401).json(false)
                return
            }
            // token is valid, we have the user object
            req.user=decodedObject;
           res.json(true)
        })
    })

UsersRouter
    .route('/login')
    .post(bodyParser,(req, res, next) => {
        //check if user exists
        UsersService.getByUsername(req.app.get('db'), req.body.username)
            .then(user => {
                //if user doesnt exist
                if (!user) {
                    res.status(401).json({
                        message: 'user does not exist'
                    })
                    return
                }

                if (!bcrypt.compareSync(req.body.userpassword, user.userpassword)) {
                    res.status(401).json({
                        message: 'password does not match'
                    })
                    return
                }
                const userToken = {
                    email: user.email,
                    username: user.username,
                    id: user.id,
                    date: Date.now()
                }
                var token = jwt.sign(userToken, 'sixteenCandles');
                res.json(token)
            })
    })

    
UsersRouter
//must be addressed not to share info
.route('/register')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
        .then(user => { 
            res.json(user)
        })
        .catch(next);
})

.post(bodyParser, (req, res, next) => {
    //check if user exists

    UsersService.getByEmail(req.app.get('db'), req.body.email)
        .then(user => {
            if (user) {
                res.status(401).json({
                    message: 'user already exists'
                })
                return
            }
    
    UsersService.getByUsername(req.app.get('db'), req.body.username)
        .then(user => {
            if (user) {
                res.status(401).json({
                    message: 'user already exists'
                })
                return
            }
            //if user doesnt exist, create user

            //encrypt the password
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.userpassword, salt);

            const userToInsert = {
                username: req.body.username,
                email: req.body.email,
                userpassword: hash,
            }
            UsersService.insertUser(req.app.get('db'), userToInsert)
                .then(user => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(user)
                })
                .catch(next);
        })
    })
})
    


module.exports = UsersRouter
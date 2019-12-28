const express = require('express')
const RemediesRouter = express.Router()
const bodyParser = express.json()
const RemediesService = require('./RemediesService')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
const AuthenticationService = require('../AuthenticationService/AuthenticationService.js')
var jwt = require('jsonwebtoken');




RemediesRouter.use('/add/:token', (req, res, next)=>{
    AuthenticationService.VerifyToken(req, res, next)
})

RemediesRouter.use('/user/:token', (req, res, next)=>{
    AuthenticationService.VerifyToken(req, res, next)
})

RemediesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
       RemediesService.getAllRemedies(knexInstance)
            .then(remedies => {
                res.json(remedies)
            })
            .catch(next);
    })


    RemediesRouter
    .route('/add/:token')
    .post(bodyParser, (req, res, next) => {

        const remedy_name = req.body.remedy_name;
        const remedy_description = req.body.remedy_description;
        const remedy_reference = req.body.remedy_reference;
        const remedy_malady = req.body.remedy_malady;
        const userid = req.user.id

        if (!remedy_name) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "remedy_name" in request body' } });
        }
        if (!remedy_description) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "remedy_description" in request body' } });
        }
        if (!remedy_reference) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "remedy_reference" in request body' } });
        }
        if (!remedy_malady) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "remedy_malady" in request body' } });
        }

        const newRemedy = {
            remedy_name,
            remedy_description,
            remedy_reference,
            remedy_malady, 
            userid
        };

        console.log(newRemedy)
        RemediesService.insertRemedy(req.app.get('db'), newRemedy)
            .then(remedy => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${remedy.id}`))
                    .json(remedy)

            })
            .catch(next)
    })

RemediesRouter
    .route('/remedy/:id')
    .all((req, res, next) => {
        RemediesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(remedy => {
                if (!remedy) {
                    return res.status(404).json({
                        error: { message: `remedy with id ${req.params.id} not found.` }
                    })
                }
                res.remedy = remedy
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {

        res.json({
            id: res.remedy.id,
            remedy_name: xss(res.remedy.remedy_name),
            remedy_description: xss(res.remedy.remedy_description), // sanitize title
            remedy_reference: xss(res.remedy.remedy_reference), // sanitize content
            remedy_malady: xss(res.remedy_malady)
        })
    })

    .delete((req, res, next) => {
        RemediesService.deleteRemedy(
            req.app.get('db'),
            req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })

    })

    .patch(jsonParser, (req, res, next) => {
        const { remedy_name, remedy_reference, remedy_description, remedy_malady} = req.body
        const remedyToUpdate = { remedy_name, remedy_reference, remedy_description, remedy_malady }

        const numberOfValues = Object.values(remedyToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'remedy_name', 'remedy_malady', 'remedy_reference' or 'remedy_description'`
                }
            })
        }

        RemediesService.updateRemedy(
            req.app.get('db'),
            req.params.id,
            remedyToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

    
RemediesRouter
    .route('/user/:token')
    .get((req,res,next)=>{
        RemediesService.getByUserId(
        req.app.get('db'),
        req.user.id
    )
        .then(remedies => {
            if (!remedies) {
                return res.status(404).json({
                    error: { message: `no remedies found for this user.` }
                })
            }
            res.json(remedies)
            next()
        })
        .catch(next)

    })
    

module.exports = RemediesRouter
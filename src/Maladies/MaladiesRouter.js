const express = require('express')
const MaladiesRouter = express.Router()
const bodyParser = express.json()
const MaladiesService = require('./MaladiesService')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
const AuthenticationService = require('../AuthenticationService/AuthenticationService')
var jwt = require('jsonwebtoken');



MaladiesRouter.use('/add/:token', (req, res, next)=>{
    AuthenticationService.VerifyToken(req, res, next)
})

MaladiesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
       MaladiesService.getAllMaladies(knexInstance)
            .then(maladies => {
                res.json(maladies)
            })
            .catch(next);
    })


    MaladiesRouter
    .route('/add/:token')
    .post(bodyParser, (req, res, next) => {

        const malady_name = req.body.malady_name;
        const malady_description = req.body.malady_description;
        const malady_symptoms = req.body.malady_symptoms;
        if (!malady_name) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "malady_name" in request body' } });
        }

        if (!malady_description) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "malady_description" in request body' } });
        }

        if (!malady_symptoms) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "malady_symptoms" in request body' } });
        }

        const newMalady = {
            malady_name,
            malady_description,
            malady_symptoms,
        };

        MaladiesService.insertMalady(req.app.get('db'), newMalady)
            .then(malady => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${malady.id}`))
                    .json(malady)
            })
            .catch(next)
    })

MaladiesRouter
    .route('/:id')
    .all((req, res, next) => {
        MaladiesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(malady => {
                if (!malady) {
                    return res.status(404).json({
                        error: { message: `Malady with id ${req.params.id} not found.` }
                    })
                }
                res.malady = malady
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {

        res.json({
            id: res.malady.id,
            malady_name: xss(res.malady.malady_name),
            malady_description: xss(res.malady.malady_description), // sanitize title
            malady_symptoms: xss(res.malady.malady_symptoms), // sanitize content
        })
    })

    .delete((req, res, next) => {
        MaladiesService.deleteMalady(
            req.app.get('db'),
            req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })

    })

    .patch(jsonParser, (req, res, next) => {
        const { malady_name, malady_symptoms, malady_description } = req.body
        const maladyToUpdate = { malady_name, malady_symptoms, malady_description }

        const numberOfValues = Object.values(maladyToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'malady_name', 'malady_symptoms' or 'malady_description'`
                }
            })
        }

        MaladiesService.updateMalady(
            req.app.get('db'),
            req.params.id,
            maladyToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = MaladiesRouter
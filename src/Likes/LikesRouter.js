const express = require('express')
const LikesRouter = express.Router()
const bodyParser = express.json()
const LikesService = require('./LikesService')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')
const AuthenticationService = require('../AuthenticationService/AuthenticationService')
var jwt = require('jsonwebtoken');



LikesRouter.use('/:token', (req, res, next)=>{
    AuthenticationService.VerifyToken(req, res, next)
})

LikesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
       LikesService.getAllLikes(knexInstance)
            .then(likes => {
                res.json(likes)
            })
            .catch(next);
    })

LikesRouter
    .route('/:token')
    .get((req, res, next)=>{
        const knexInstance = req.app.get('db')
        LikesService.getByUserId(knexInstance, req.user.id)
            .then(likes=>{
                if(!likes){
                    return res
                            .status(204)
                }
                res.json(likes)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {

        const userid = req.user.id;
        const remedyid = req.body.remedyid;
        const liked = req.body.liked;

        if (!userid) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "userId" in request body' } });
        }

        if (!remedyid) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "remedyId" in request body' } });
        }

        if (!liked) {
            return res
                .status(400)
                .json({ error: { message: 'Missing "liked" in request body' } });
        }


        const newLike = {
            userid,
            remedyid,
            liked,
        };

        LikesService.insertLike(req.app.get('db'), newLike)
            .then(like => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${like.id}`))
                    .json(like)
            })
            .catch(next)
    })

    LikesRouter
        .route('/:token/getbyrem/:remid')
        .get((req, res, next) => {
            LikesService.getByRemAndUser(
                req.app.get('db'),
                req.params.remid, 
                req.user.id)
                .then(like => {
                    if (!like) {
                        return res.status(404).json({
                            error: { message: `Like with id ${req.params.remid} not found.` }
                        })
                    }
                    res.json({like})
                    next()
                })
                .catch(next)
        })
        
        LikesRouter
    .route('/:token/:id')
    .all((req, res, next) => {
        LikesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(like => {
                if (!like) {
                    return res.status(404).json({
                        error: { message: `Like with id ${req.params.id} not found.` }
                    })
                }
                res.like = like
                console.log(like)
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: xss(res.like.id),
            userid: xss(res.like.userid),
            remedyid: xss(res.like.remedyid), // sanitize title
            liked: xss(res.like.liked), // sanitize content
        })
    })

    .delete((req, res, next) => {
        LikesService.deleteLike(
            req.app.get('db'),
            req.params.id)
            .then(() => {
                res
                    .status(204)
                    .end();
            })
    })

    .patch(jsonParser, (req, res, next) => {
        let liked = req.body.liked
        const remedyid = req.body.remedyid
        const userid = req.user.id
        if (liked ==="null"){
            console.log (null)
            liked=null
        }
        const likeToUpdate = { userid, liked, remedyid }

        const numberOfValues = Object.values(likeToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'userId', 'liked' or 'remedyId'`
                }
            })
        }

        LikesService.updateLike(
            req.app.get('db'),
            req.params.id,
            likeToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = LikesRouter
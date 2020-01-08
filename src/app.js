require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const UsersRouter = require('./Users/UsersRouter')
const RemediesRouter = require('./Remedies/RemediesRouter')
const MaladiesRouter = require('./Maladies/MaladiesRouter')
const LikesRouter = require('./Likes/LikesRouter')

const app = express()

const morganOption = (NODE_ENV === 'production')  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})



app.use('/users', UsersRouter)
app.use('/remedies', RemediesRouter)
app.use('/maladies', MaladiesRouter)
app.use('/likes', LikesRouter)


 app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {       response = { error: { message: 'server error' } }
    } else {
     console.error(error)
     response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app
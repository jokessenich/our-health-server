const { expect }= require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Users Endpoints', function(){
    let db

    before ('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: "postgresql://dunder_mifflin:a@localhost/our_health-test"
        })
        app.set('db', db)
    })
    after('disconnect from db', ()=> db.destroy())
    before('clean the table', () => db.raw('TRUNCATE likes, remedies, maladies, users RESTART IDENTITY CASCADE'))
    afterEach('clean the table', () => db.raw('TRUNCATE likes, remedies, maladies, users RESTART IDENTITY CASCADE'))

    const testUsers = [
        {
            username: "me",
            email: "ab",
        userpassword: "cd" },
        {
            username: "you",
            email:"cd",
        userpassword: "ef" },
        {
            username: "they",
            email: "gh",
        userpassword: "ij" }
    ]

    context('Given there are users in the database',()=>{

        this.beforeEach('insert users', ()=>{
            return db
            .into('users')
            .insert(testUsers)
        })



           it('GET /users/register responds with 200 and all of the users', () => {
                 return supertest(app)
                   .get('/users/register')
                   .expect(200)
               })
            })
        


           it('POST /users/register responds with 201 and logs in', () => {
            return supertest(app)
              .post('/users/register')
              .send({
                  username: "new",
                  email: "newemail",
                  userpassword: "one"
              })
              .expect(201)
          })

          it('POST /users/login responds with 201 and logs in', () => {
            return supertest(app)
              .post('/users/login')
              .send({
                  username: "they",
                  userpassword: "ij"
              })
              .expect(200)
          })
               
    })


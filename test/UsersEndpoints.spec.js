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
    before('clean the table', () => db('remedies').truncate())
    afterEach('cleanup', () => db('remedies').truncate())


    context('Given there are users in the database',()=>{
        const testUsers = [
            {
                id:1,
                email: "ab",
            userpassword: "cd" },
            {
                id:2,
                email:"cd",
            userpassword: "ef" },
            {
                id:3,
                email: "gh",
            userpassword: "ij" }
        ]

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
            
            it('')
               
    })
})
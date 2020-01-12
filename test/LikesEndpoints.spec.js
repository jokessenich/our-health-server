const { expect }= require('chai')
const knex = require('knex')
const app = require('../src/app')

describe('Likes Endpoints', function(){
    let db

    before ('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: "postgresql://dunder_mifflin:a@localhost/our-health-server-test"})
        app.set('db', db)
    })
    after('disconnect from db', ()=> db.destroy())
    before('clean the table', () => db.raw('TRUNCATE likes, remedies, maladies, users RESTART IDENTITY CASCADE'))
    afterEach('clean the table', () => db.raw('TRUNCATE likes, remedies, maladies, users RESTART IDENTITY CASCADE'))

    const testUsers = [
        {
            id:1,
            username: "me",
            email: "ab",
        userpassword: "cd" },
        {
            id:2,
            username: "you",
            email:"cd",
        userpassword: "ef" },
        {
            id: 3,
            username: "they",
            email: "gh",
        userpassword: "ij" }
    ]

    const testMaladies = [
        {
            id:1,
            malady_name: "lice",
            malady_description: "bad bugs",
            malady_symptoms: "itchy", 
            userid : null 
    },
        {
            id:2,
            malady_name: "cold",
            malady_description: "virus",
            malady_symptoms: "cough", 
            userid : null
    },
        {
            id:3,
            malady_name: "obesity",
            malady_description: "being overweight",
            malady_symptoms: "overeating", 
            userid : null
    },
    ]

    const testLikes = [

        {
            userid: "1",
            remedyid: "1",
            liked: true
        },

        {
            userid: "2",
            remedyid: "2",
            liked: null
        },

       {
            userid: "3",
            remedyid: "3",
            liked: false
        },
    ]

    const testRemedies = [
        {
            id:1,
            remedy_name: "lice",
            remedy_description: "bad bugs",
            remedy_reference: "abc",
            remedy_malady: 1, 
            userid : null 
    },
        {
            id:2,
            remedy_name: "cold",
            remedy_description: "virus",
            remedy_reference: "abc",
            remedy_malady: 2, 
            userid : null
    },
        {
            id:3,
            remedy_name: "obesity",
            remedy_description: "being overweight",
            remedy_reference: "abc",
            remedy_malady: 3, 
            userid : null
    },
    ]


    context('Given there are likes in the database',()=>{

        this.beforeEach('insert users', ()=>{
            return db
            .into('users')
            .insert(testUsers)
        })

        this.beforeEach('insert maladies', ()=>{
            return db
            .into('maladies')
            .insert(testMaladies)
        })

        this.beforeEach('insert remedies', ()=>{
            return db
            .into('remedies')
            .insert(testRemedies)
        })

        this.beforeEach('insert likes', ()=>{
            return db
            .into('likes')
            .insert(testLikes)
        })

        this.beforeEach('declare token', ()=>{
            let token;
           
            supertest(app)
            .post('/users/login')
            .send({
                
              username: "me",
              userpassword: "cd"
                
            })
            .end(res=> {
                token = JSON.stringify(res)
                })
            })
        

           it('GET / responds with 200 and all of the likes', () => {
                 return supertest(app)
                   .get('/likes')
                   .expect(200)
               })
            })
        
            it('GET /likes/:token responds with the users likes', () => {
                return supertest(app)
                  .get(`/likes/${this.token}`)
                  .expect(200)
              })

           it('POST /likes/:token creates a new like', () => {
            return supertest(app)
              .post(`/likes/${this.token}`)
              .send({
                userid: "3",
                remedyid: "3",
                liked: false
              })
              .expect(201)
          })

          it('GET /likes/:token/:id gets likes for user for the remedy', () => {
            return supertest(app)
              .get(`/likes/${this.token}/1`)
              .expect(200)
          })
               
    })


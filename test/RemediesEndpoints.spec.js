const { expect }= require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Test Remedies Endpoints', function(){
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

        
        describe('GET / Endpoints', ()=>{
            context('Given there are no remedies in the database',()=>{

                it('GET / responds with 200 and no remedies', () => {
                    return supertest(app)
                      .get('/remedies')
                      .expect(200, [])
                  })
   
                  it('GET /:id responds with 404', () => {
                   return supertest(app)
                     .get('/remedies/remedy/1')
                     .expect(404)
                     })
                 })

            context('Given there are remedies in the database',()=>{
                
                beforeEach('insert maladies', ()=>{
                    return db
                    .into('maladies')
                    .insert(testMaladies)
                })

                beforeEach('insert remedies', ()=>{
                    return db
                    .into('remedies')
                    .insert(testRemedies)
                })



           it('GET / responds with 200 and all of the remedies', () => {
                 return supertest(app)
                   .get('/remedies')
                   .expect(200)
               })

               it('GET /:id responds with the correct remedy', () => {
                return supertest(app)
                  .get('/remedies/remedy/1')
                  .expect(200)
                  .expect(res=> {
                    expect(res.body.id).to.eql(testRemedies[0].id)
                    expect(res.body.remedy_description).to.eql(testRemedies[0].remedy_description)
                    expect(res.body.remedy_name).to.eql(testRemedies[0].remedy_name)

                  })
              })
               })
            })

 
            context('Given there are remedies in the database',()=>{
                
                beforeEach('insert maladies', ()=>{
                    return db
                    .into('maladies')
                    .insert(testMaladies)
                })

                beforeEach('insert remedies', ()=>{
                    return db
                    .into('remedies')
                    .insert(testRemedies)
                })

              it('DELETE /:id delete the correct malady', () => {
                  const idToRemove = 2;
                  const expectedResult = testRemedies.filter(remedies=> remedies.id!==2)
                return supertest(app)
                  .delete(`/remedies/remedy/${idToRemove}`)
                  .expect(204)
                  .then(res=>
                    supertest(app)
                  .get('/remedies')
                  .expect(expectedResult))
                  
              })
            })
        })
        

            


            
               
    

const { expect }= require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Maladies Endpoints', function(){
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

        
        describe('GET / Endpoints', ()=>{
            context('Given there are no maladies in the database',()=>{

                it('GET / responds with 200 and no maladies', () => {
                    return supertest(app)
                      .get('/maladies')
                      .expect(200, [])
                  })
   
                  it('GET /:id responds with 404', () => {
                   return supertest(app)
                     .get('/maladies/1')
                     .expect(404)
                     })
                 })

            context('Given there are maladies in the database',()=>{

                beforeEach('insert maladies', ()=>{
                    return db
                    .into('maladies')
                    .insert(testMaladies)
                })

           it('GET / responds with 200 and all of the maladies', () => {
                 return supertest(app)
                   .get('/maladies')
                   .expect(200)
               })

               it('GET /:id responds with the correct malady', () => {
                return supertest(app)
                  .get('/maladies/1')
                  .expect(200)
                  .expect(res=> {
                    expect(res.body.id).to.eql(testMaladies[0].id)
                    expect(res.body.malady_description).to.eql(testMaladies[0].malady_description)
                    expect(res.body.malady_name).to.eql(testMaladies[0].malady_name)
                    expect(res.body.malady_symptoms).to.eql(testMaladies[0].malady_symptoms)

                  })
              })
               })
            })

            context('Given there are maladies in the database',()=>{

                beforeEach('insert maladies', ()=>{
                    return db
                    .into('maladies')
                    .insert(testMaladies)
                })
              it('DELETE /:id delete the correct malady', () => {
                  const idToRemove = 2;
                  const expectedResult = testMaladies.filter(maladies=> maladies.id!==2)
                return supertest(app)
                  .delete(`/maladies/${idToRemove}`)
                  .expect(204)
                  .then(res =>
                    supertest(app)
                    .get(`/maladies`)
                    .expect(expectedResult)
              )
            })
        })
    })
          
        

            


            
               
    

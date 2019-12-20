const knex = require('knex')

const RemediesService = {
  getAllRemedies(knex) {
    return knex.select('*').from('remedies')
  },

  insertRemedy(knex, newRemedy) {
    return knex
      .insert(newRemedy)
      .into('remedies')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex.from('remedies').select('*').where('id', id).first()
  },

  getByUserId(knex, id) {
    return knex.from('remedies').select('*').where('userid', id)
  },

  deleteRemedy(knex, id) {
    return knex('remedies')
      .where({ id })
      .delete()
  },

  updateRemedy(knex, id, newRemedyFields) {
    return knex('remedies')
      .where({ id })
      .update(newRemedyFields)
  },
}

module.exports = RemediesService
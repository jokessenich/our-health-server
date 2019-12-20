const knex = require('knex')

const MaladiesService = {
  getAllMaladies(knex) {
    return knex.select('*').from('maladies')
  },

  insertMalady(knex, newMalady) {
    return knex
      .insert(newMalady)
      .into('maladies')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex.from('maladies').select('*').where('id', id).first()
  },

  getByUserId(knex, id) {
    return knex.from('maladies').select('*').where('userid', id)
  },

  deleteMalady(knex, id) {
    return knex('maladies')
      .where({ id })
      .delete()
  },

  updateMalady(knex, id, newMaladyFields) {
    return knex('maladies')
      .where({ id })
      .update(newMaladyFields)
  },
}

module.exports = MaladiesService
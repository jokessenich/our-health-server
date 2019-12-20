const knex = require('knex')

const LikesService = {
  getAllLikes(knex) {
    return knex.select('*').from('likes')
  },

  insertLike(knex, newLike) {
    return knex
      .insert(newLike)
      .into('likes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getByRemedyId(knex, id) {
    return knex.from('likes').select('*').where('remedyid', id).first()
  },

  getByUserId(knex, id) {
    return knex.from('likes').select('*').where('userid', id)
  },

  getById(knex, id) {
    return knex.from('likes').select('*').where('id', id).first()
  },

  getByRemAndUser(knex, remedyid, userid){
    return knex.from('likes').select('*').where('remedyid', remedyid).andWhere('userid', userid).first()
  },


  deleteLike(knex, id) {
    return knex('likes')
      .where({ id })
      .delete()
  },

  updateLike(knex, id, newLikeFields) {
    return knex('likes')
      .where({ id })
      .update(newLikeFields)
  },
}

module.exports = LikesService
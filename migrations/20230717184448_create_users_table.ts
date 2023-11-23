exports.up = function (knex: any) {
  return knex.schema.createTable('users', function (table: any) {
    table.increments('id').primary()
    table.string('firstname').notNullable()
    table.string('lastname').notNullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('avatar').nullable()
    table.timestamps(true, true)
  })
};

exports.down = function (knex: any) {
  return knex.schema.dropTable('users')
}
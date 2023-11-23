exports.up = function(knex: any) {
  return knex.schema.createTable('products', function (table: any) {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.text('description').nullable()
    table.string('barcode').notNullable()
    table.string('image').nullable()
    table.integer('stock').notNullable()
    table.integer('price').notNullable(),
    table.integer('category_id').unsigned().notNullable()
    table.integer('user_id').unsigned().notNullable()
    table.integer('status_id').unsigned().notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function(knex: any) {
  return knex.schema.dropTable('products')
}
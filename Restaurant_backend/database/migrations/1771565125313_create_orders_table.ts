// database/migrations/1710000000004_orders.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.integer('reservation_id').unsigned().references('id').inTable('reservations').onDelete('CASCADE').unique()
      
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.decimal('total_amount', 10, 2).defaultTo(0)

      table.enum('status', ['pending', 'cooking', 'served','cancelled']).defaultTo('pending')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
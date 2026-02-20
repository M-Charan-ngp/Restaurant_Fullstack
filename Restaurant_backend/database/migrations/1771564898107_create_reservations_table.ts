// database/migrations/1710000000003_reservations.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('table_id').unsigned().references('id').inTable('tables').onDelete('RESTRICT')
      
      table.date('reservation_date').notNullable()
      table.time('time_slot').notNullable()
      table.time('time_slot_end').notNullable()
      table.integer('guest_count').notNullable()
      
      table.enum('status', ['pending', 'confirmed', 'arrived', 'cancelled','completed']).defaultTo('pending')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
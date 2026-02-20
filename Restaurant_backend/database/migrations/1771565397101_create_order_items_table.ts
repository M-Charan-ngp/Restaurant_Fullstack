// database/migrations/1710000000005_order_items.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table.integer('menu_item_id').unsigned().references('id').inTable('menu_items')
      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('unit_price', 10, 2).notNullable() 

      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
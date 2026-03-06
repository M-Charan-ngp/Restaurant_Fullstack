import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('image_path').nullable()
    })
  }
}
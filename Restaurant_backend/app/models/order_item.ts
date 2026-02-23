import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from './order.js'
import MenuItem from './menu_item.js'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare menuItemId: number

  @column()
  declare quantity: number
  
  @column()
  declare unitPrice: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => MenuItem)
  declare menuItem: BelongsTo<typeof MenuItem>
}
import { DateTime } from 'luxon'
import { BaseModel, column, scope, hasMany} from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import OrderItem from './order_item.js'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => OrderItem)
  declare orderItems: HasMany<typeof OrderItem>

  public static visible = scope((query) => {
    query.where('is_available', true)
  })
}
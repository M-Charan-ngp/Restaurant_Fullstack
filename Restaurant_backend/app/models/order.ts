import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Reservation from './reservation.js'
import OrderItem from './order_item.js'
import User from './user.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare reservationId: number

  @column()
  declare userId: number

  @column()
  declare totalAmount: number

  @column()
  declare status: 'pending' | 'cooking' | 'served' | 'cancelled'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relationships ---

  @belongsTo(() => Reservation)
  declare reservation: BelongsTo<typeof Reservation>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>
}
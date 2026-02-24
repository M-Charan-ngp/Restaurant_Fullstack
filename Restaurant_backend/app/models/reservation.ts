import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import Table from './table.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Order from './order.js'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare tableId: number

  @column.date()
  declare reservationDate: DateTime
  @column()
  declare timeSlot: string

  @column()
  declare timeSlotEnd: string

  @column()
  declare guestCount: number

  @column()
  declare status: 'pending' | 'confirmed' | 'arrived' | 'cancelled' | 'completed'

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  // --- Relationships ---

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Table)
  declare table: BelongsTo<typeof Table>

  @hasOne(() => Order)
  declare order: HasOne<typeof Order>
}
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany} from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reservation from './reservation.js'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tableNumber: string

  @column()
  declare capacity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>
}
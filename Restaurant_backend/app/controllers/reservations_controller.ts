import Reservation from '#models/reservation'
import { DateTime } from 'luxon'
import Table from '#models/table'
import { HttpContext } from '@adonisjs/core/http'
import { createReservationValidator, updateReservationStatusValidator, availabilityValidator, reservationQueryValidator } from '#validators/reservation_validator'
import { paginationValidator } from '#validators/common_validator'
import db from '@adonisjs/lucid/services/db'

export default class ReservationsController {

async checkAvailability({ request, response }: HttpContext) {
  const { date, guests, timeSlot } = await request.validateUsing(availabilityValidator)
  const requestedStart = timeSlot
  const requestedEnd = DateTime.fromFormat(timeSlot, 'HH:mm').plus({ hours: 2 }).toFormat('HH:mm')

  const busyTables = await db
    .from('reservations')
    .select('table_id')
    .where('reservation_date', date)
    .whereNot('status', 'cancelled')
    .where((query) => {
      query
        .whereRaw('time_slot < ?', [requestedEnd])
        .andWhereRaw('time_slot_end > ?', [requestedStart])
    })

  const bookedTableIds = busyTables.map((r) => r.table_id)
  const availableTables = await Table.query()
    .whereNotIn('id', bookedTableIds)
    .where('capacity', '>=', guests)
  return response.ok(availableTables)
}

async store({ user, request, response }: HttpContext) {
  const payload = await request.validateUsing(createReservationValidator)

  const startTime = DateTime.fromFormat(payload.timeSlot, 'HH:mm')
  const endTime = startTime.plus({ hours: 2 })

  const conflict = await Reservation.query()
    .where('table_id', payload.tableId)
    .where('reservation_date', payload.reservationDate)
    .whereNot('status', 'cancelled')
    .where((query) => {
      query
        .whereRaw('time_slot < ?', [endTime.toFormat('HH:mm')])
        .andWhereRaw('time_slot_end > ?', [payload.timeSlot])
    })
    .first()

  if (conflict) {
    return response.conflict({ message: 'This table is occupied during part of your selected time.' })
  }

  const reservation = await Reservation.create({
    ...payload,
    userId: user!.id,
    reservationDate: DateTime.fromISO(payload.reservationDate),
    timeSlotEnd: endTime.toFormat('HH:mm'),
    status: 'pending'
  })

  return response.created(reservation)
}

async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(reservationQueryValidator)
    
    const page = payload.page || 1
    const limit = payload.limit || 15
    const selectedDate = payload.date || DateTime.now().toISODate()

    const reservations = await Reservation.query()
        .where('reservation_date', selectedDate!)
        .preload('user', (q) => q.select('id', 'fullName', 'phoneNumber'))
        .preload('table')
        .preload('order')
        .orderBy('time_slot', 'asc')
        .paginate(page, limit)
    
    return response.ok(reservations)
}

async myReservations({ user, request, response }: HttpContext) {
  const { page = 1, limit = 10 } = await request.validateUsing(paginationValidator)

  if (!user) {
    return response.unauthorized({ message: 'User not found' })
  }

  const reservations = await Reservation.query()
    .where('user_id', user.id)
    .orderBy('time_slot', 'desc')
    .preload('table') 
    .preload('order', (q) => {
      q.preload('items', (iq) => iq.preload('menuItem')) 
    })
    .paginate(page, limit)

  return response.ok(reservations)
}

    async updateStatus({ params, request, response }: HttpContext) {
        const reservation = await Reservation.findOrFail(params.id)
        const { status } = await request.validateUsing(updateReservationStatusValidator)
        reservation.status = status
        await reservation.save()
        return response.ok({ message: 'Status updated', reservation })
    }
}
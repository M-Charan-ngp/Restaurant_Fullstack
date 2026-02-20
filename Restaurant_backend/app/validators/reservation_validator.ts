// app/validators/reservation.ts
import vine from '@vinejs/vine'

export const createReservationValidator = vine.compile(
  vine.object({
    tableId: vine.number().exists({ table: 'tables', column: 'id' }),
    reservationDate: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/), 
    timeSlot: vine.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    guestCount: vine.number().min(1)
  })
)
export const availabilityValidator = vine.compile(
  vine.object({
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guests: vine.number().min(1).max(20),
    timeSlot: vine.string().trim(),
  })
)

export const updateReservationStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'confirmed', 'arrived', 'cancelled', 'completed'])
  })
)
export const reservationQueryValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    limit: vine.number().optional(),
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD
  })
)
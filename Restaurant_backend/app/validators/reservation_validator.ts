import vine from '@vinejs/vine'
import { FieldContext, Infer } from '@vinejs/vine/types'

const isFutureDateTime = vine.createRule(async (value: unknown, _, field: FieldContext) => {
  const data = field.data as { date: string }
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    return
  }

  const selectedDateTime = new Date(`${data.date}T${value}:00`)
  const now = new Date()
  if (isNaN(selectedDateTime.getTime()) || selectedDateTime < now) {
    field.report(
      'The selected date and time must be in the future',
      'future_datetime',
      field
    )
  }
})

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
    timeSlot: vine.string().trim().use(isFutureDateTime()),
  })
)

export const updateReservationStatusValidator = vine.compile(
  vine.object({
    params: vine.object({
      id:vine.number().exists(async (db,value) => {
        const match = await db.from('reservations').where('id',value).first()
        return !!match
      })
    }),
    status: vine.enum(['pending', 'confirmed', 'arrived', 'cancelled', 'completed'])
  })
)
export const reservationQueryValidator = vine.compile(
  vine.object({
    page: vine.number().positive().parse((value) => value ?? 1),
    limit: vine.number().positive().max(100).parse((value) => value ?? 10),
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
)

export type reservationDataDto = Infer<typeof createReservationValidator>
export type updateReservationStatusDto = Infer<typeof updateReservationStatusValidator>
export type reservationQueryDataDto = Infer<typeof reservationQueryValidator>
export type availabilityDataDto = Infer<typeof availabilityValidator>
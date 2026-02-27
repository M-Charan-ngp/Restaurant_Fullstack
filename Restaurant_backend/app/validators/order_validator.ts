import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createOrderValidator = vine.compile(
  vine.object({
    reservationId: vine.number().exists({ table: 'reservations', column: 'id' }),
    items: vine.array(
      vine.object({
        menuItemId: vine.number().exists({ table: 'menu_items', column: 'id' }),
        quantity: vine.number().min(1).max(50),
      })
    ).minLength(1) 
  })
)

export const updateOrderStatusValidator = vine.compile(
  vine.object({
    params: vine.object({
      id:vine.number().exists(async (db,value) => {
        const match = await db.from('orders').where('id',value).first()
        return !!match
      })
    }),
    status: vine.enum(['pending', 'cooking', 'served','cancelled'])
  })
)
export const cancelOrderValidator = vine.compile(
  vine.object({
    params: vine.object({
      id:vine.number().exists(async (db,value) => {
        const match = await db.from('orders').where('id',value).first()
        return !!match
      })
    }),
  })
)
export type orderDataDto = Infer<typeof createOrderValidator>
export type orderStatusDataDto = Infer<typeof updateOrderStatusValidator>
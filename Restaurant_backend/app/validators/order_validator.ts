import vine from '@vinejs/vine'

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
    
    status: vine.enum(['pending', 'cooking', 'served','cancelled'])
  })
)

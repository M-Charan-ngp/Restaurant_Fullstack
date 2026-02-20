import Order from '#models/order'
import OrderItem from '#models/order_item'
import MenuItem from '#models/menu_item'
import Reservation from '#models/reservation'
import { HttpContext } from '@adonisjs/core/http'
import { createOrderValidator, updateOrderStatusValidator } from '#validators/order_validator'
import { paginationValidator } from '#validators/common_validator'
import db from '@adonisjs/lucid/services/db'

export default class OrdersController {

async index({ user, request, response }: HttpContext) {
  const { page = 1, limit = 10 } = await request.validateUsing(paginationValidator)
  if (!user) {
      return response.unauthorized({ message: 'User session expired' })
  }
  const orders = await Order.query()
      .where('user_id', user.id) 
      .orderBy('created_at', 'desc')
      .preload('items', (q) => {
        q.preload('menuItem')
      })
      .preload('reservation', (q) => {
        q.preload('table') 
      })
      .paginate(page, limit)

  return response.ok(orders)
}

  async store({ user, request, response }: HttpContext) {
    if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
    }

    const payload = await request.validateUsing(createOrderValidator)
    const reservation = await Reservation.query()
        .where('id', payload.reservationId)
        .where('user_id', user.id) 
        .first()

    if (!reservation) {
        return response.forbidden({ message: 'Invalid reservation for this user.' })
    }

    const transaction = await db.transaction()

    try {
        const order = new Order()
        order.reservationId = payload.reservationId
        order.userId = user.id
        order.status = 'pending'
        
        let totalAmount = 0
        
        order.useTransaction(transaction)
        await order.save()

        for (const item of payload.items) {
        const menuItem = await MenuItem.findOrFail(item.menuItemId)
        
        const orderItem = new OrderItem()
        orderItem.orderId = order.id
        orderItem.menuItemId = item.menuItemId
        orderItem.quantity = item.quantity
        orderItem.unitPrice = menuItem.price
        
        totalAmount += Number(menuItem.price) * item.quantity
        
        orderItem.useTransaction(transaction)
        await orderItem.save()
        }

        order.totalAmount = totalAmount
        await order.save()
        await transaction.commit()

        return response.created({ message: 'Order placed successfully', order })

    } catch (error) {
        await transaction.rollback()
        return response.internalServerError({ 
        message: 'Could not process order', 
        error: error.message 
        })
    }
    }

async updateStatus({ params, request, response }: HttpContext) {
  const order = await Order.findOrFail(params.id)
  
  const { status } = await request.validateUsing(updateOrderStatusValidator)

  order.status = status
  await order.save()

  return response.ok({
    message: `Order #${order.id} is now ${status}`,
    order
  })
}
async cancel({ params, user, response }: HttpContext) {
  const order = await Order.query()
    .where('id', params.id)
    .where('user_id', user!.id)
    .firstOrFail()
  if (order.status !== 'pending') {
    return response.badRequest({ 
      status: false,
      message: 'Cannot cancel order. The kitchen has already started preparing your food.' 
    })
  }

  order.status = 'cancelled'
  await order.save()

  return response.ok({
    status: true,
    message: 'Order cancelled successfully.'
  })
}
  async kitchenView({ request, response }: HttpContext) {
    const { page = 1, limit = 20 } = await request.validateUsing(paginationValidator)

    const orders = await Order.query()
      .whereIn('status', ['pending', 'cooking'])
      .preload('items', (q) => q.preload('menuItem'))
      .preload('reservation', (q) => q.preload('table'))
      .orderBy('created_at', 'asc')
      .paginate(page, limit)
    
    return response.ok(orders)
  }
}
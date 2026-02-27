import { paginationDataDto } from "#validators/common_validator";
import { orderDataDto, orderStatusDataDto } from "#validators/order_validator";
import Order from "#models/order";
import User from "#models/user";
import db from "@adonisjs/lucid/services/db";
import Reservation from "#models/reservation";
import MenuItem from "#models/menu_item";
import OrderItem from "#models/order_item";
export default class orderRepository{

    async listOrders(params:paginationDataDto, user:User){
        const orders = await Order.query()
              .where('user_id', user!.id) 
              .orderBy('created_at', 'desc')
              .preload('items', (q) => {
                q.preload('menuItem')
              })
              .preload('reservation', (q) => {
                q.preload('table') 
              })
              .paginate(params.page, params.limit)

        return orders;
    }
    async createOrder(payload:orderDataDto,user:User){
        const reservation = await Reservation.query()
            .where('id', payload.reservationId)
            .where('user_id', user!.id) 
            .first()

        if (!reservation) {
            throw Object.assign(new Error('Invalid reservation for this user.'), {
                                    code: 401,
                                    status: 'BAD_REQUEST'
                                });
        }
        const existingOrder = await Order.query()
                                    .where('reservation_id',payload.reservationId)
                                    .whereNot('status','cancelled')
    
        if (existingOrder) {
            throw new Error('An order has already been placed for this reservation.');
        }
        const transaction = await db.transaction()
        try {
            const order = new Order()
            order.reservationId = payload.reservationId
            order.userId = user!.id
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
            return order;
        } catch (error) {
            await transaction.rollback()
            throw error;
        }
    }
    async updateOrderStatus(payload: orderStatusDataDto){
        const order = await Order.findOrFail(payload.params.id)
        order.status = payload.status
        await order.save()
        return order
    }
    async cancelOrder(id:number,user:User){
        const order = await Order.query()
              .where('id', id)
              .where('user_id', user!.id)
              .firstOrFail()
            if (order.status !== 'pending') {
                throw Object.assign(new Error('Cannot cancel order. The kitchen has already started preparing your food.'), {
                        code: 401,
                        status: 'BAD_REQUEST'
                });
            }
            order.status = 'cancelled'
            await order.save()
            return true;
    }

    async kitchenList(params: paginationDataDto){
        const orders = await Order.query()
              .whereIn('status', ['pending', 'cooking'])
              .preload('items', (q) => q.preload('menuItem'))
              .preload('reservation', (q) => q.preload('table'))
              .orderBy('created_at', 'asc')
              .paginate(params.page, params.limit)
        return orders;
    }
}
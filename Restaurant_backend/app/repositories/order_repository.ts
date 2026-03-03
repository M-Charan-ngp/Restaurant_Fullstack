import { paginationDataDto } from "#validators/common_validator";
import { orderDataDto, orderStatusDataDto } from "#validators/order_validator";
import Order from "#models/order";
import User from "#models/user";
import MenuItem from "#models/menu_item";
export default class orderRepository{

    async listOrders(params:paginationDataDto, user:User){
        const orders = await Order.query()
            .where('user_id', user!.id)
            .select('id', 'reservation_id', 'total_amount', 'status', 'created_at')
            .orderBy('created_at', 'desc')
            .preload('items', (itemsQuery) => {
                itemsQuery
                    .select('id', 'order_id', 'menu_item_id', 'quantity', 'unit_price')
                    .preload('menuItem', (menuQuery) => {
                        menuQuery.select('id', 'name')
                    })
            })
            .preload('reservation', (resQuery) => {
                resQuery
                .select('id', 'table_id', 'reservation_date', 'time_slot', 'time_slot_end')
                .preload('table', (tableQuery) => {
                    tableQuery.select('id', 'table_number')
                })
            })
            .paginate(params.page, params.limit)

        return orders;
    }
    async createOrder(payload: orderDataDto, user: User) {
        const existingOrders = await Order.query()
            .where('reservation_id', payload.reservationId)
            .whereNot('status', 'cancelled')

        if (existingOrders.length > 0) {
            throw {
                code:409,
                message:'An order has already been placed for this reservation.'
            }
        }
        const itemData = await Promise.all(
            payload.items.map(async (item) => {
            const menuItem = await MenuItem.findOrFail(item.menuItemId)
            return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: menuItem.price,
                subtotal: Number(menuItem.price) * item.quantity,
            }
            })
        )
        const totalAmount = itemData.reduce((sum, item) => sum + item.subtotal, 0)
        const order = await Order.create({
            reservationId: payload.reservationId,
            userId: user.id,
            status: 'pending',
            totalAmount: totalAmount,
        })
        await order.related('items').createMany(
            itemData.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            }))
        )

        return order
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
                throw {
                        code: 401,
                        status: 'BAD_REQUEST',
                        message: 'Cannot cancel order. The kitchen has already started preparing your food.'
                };
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
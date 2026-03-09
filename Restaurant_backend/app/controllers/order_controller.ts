import { HttpContext } from '@adonisjs/core/http'
import { cancelOrderValidator, createOrderValidator, updateOrderStatusValidator } from '#validators/order_validator'
import { paginationValidator } from '#validators/common_validator'
import orderRepository from '../repositories/order_repository.js'
import { inject } from '@adonisjs/core'
import OrderEntity from '../domains/order_domain.js'
import OrderPlaced  from '#events/order_placed'
import emitter from '@adonisjs/core/services/emitter'

@inject()
export default class OrdersController {

constructor(protected repository: orderRepository) {}

  async index({ user, request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const orders = await this.repository.listOrders(params,user!)
    const verifiedData = OrderEntity.fromCollection(orders.toJSON().data)
    return {
      status:true,
      orders: {
        ...orders.toJSON(),
        data: verifiedData
      }
    }
  }

  async store({ user, request }: HttpContext) {
    const payload = await request.validateUsing(createOrderValidator)
    const rawOrder = await this.repository.createOrder(payload,user!)
    const order = new OrderEntity(rawOrder).toJSON()
    await emitter.emit(OrderPlaced, new OrderPlaced(rawOrder))
    return { 
          status:true,
          message: 'Order placed successfully', 
          order 
        }
    }

  async updateStatus({params, request }: HttpContext) {
    const payload = await request.validateUsing(updateOrderStatusValidator,{
        meta: { orderId: params.id }
      })
    const rawOrder = await this.repository.updateOrderStatus(payload)
    const order = new OrderEntity(rawOrder).toJSON()
    return {
      status:true,
      message: `Order #${order.id} is now ${order.status}`,
      order
    }
  }

  async cancel({ user, request }: HttpContext) {
    const {params} = await request.validateUsing(cancelOrderValidator)
    const status = await this.repository.cancelOrder(params.id,user!)
    if(status){
      return {
        status: true,
        message: 'Order cancelled successfully.'
      }
    }
  }

  async kitchenView({ request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const orders = await this.repository.kitchenList(params)
    const verifiedData = OrderEntity.fromCollection(orders.toJSON().data)
    return {
      status: true,
      orders: {
        ...orders.toJSON(),
        data: verifiedData
      }
    }
  }
}
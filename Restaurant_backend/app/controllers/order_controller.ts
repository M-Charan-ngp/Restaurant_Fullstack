import { HttpContext } from '@adonisjs/core/http'
import { cancelOrderValidator, createOrderValidator, updateOrderStatusValidator } from '#validators/order_validator'
import { paginationValidator } from '#validators/common_validator'
import orderRepository from '../repositories/order_repository.js'

export default class OrdersController {

  protected repository = new orderRepository()

  async index({ user, request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const orders = await this.repository.listOrders(params,user!)

    return {
      status:true,
      orders
    }
  }

  async store({ user, request }: HttpContext) {
    const payload = await request.validateUsing(createOrderValidator)
    const order = await this.repository.createOrder(payload,user!)
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
    const order = await this.repository.updateOrderStatus(payload)
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
    return {
      status: true,
      orders
    }
  }
}
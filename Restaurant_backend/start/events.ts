import emitter from '@adonisjs/core/services/emitter'
import OrderPlaced from '#events/order_placed'
import transmit from '@adonisjs/transmit/services/main'
import OrderEntity from '../app/domains/order_domain.js'

emitter.on(OrderPlaced, async (event) => {
    const orderId = event.order.id
    await event.order.load('reservation')
    await event.order.load('items')
    const formattedOrder = new OrderEntity(event.order).toJSON()

    console.log(formattedOrder)
    transmit.broadcast('orders/kitchen', {
        type: 'NEW_ORDER',
        data: formattedOrder
    })
  
  console.log(`Real-time broadcast sent for Order: ${orderId}`)
})
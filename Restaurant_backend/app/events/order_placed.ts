import { BaseEvent } from '@adonisjs/core/events'
import Order from '#models/order'
export default class OrderPlaced extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public order:Order) {
    super()
  }
}
import type { ApplicationService } from '@adonisjs/core/types'
import AuthRepository from '../app/repositories/auth_repository.js'
import orderRepository from '../app/repositories/order_repository.js'
import reservationRepository from '../app/repositories/reservation_repository.js'
import tableRepository from '../app/repositories/table_repository.js'
import menuRepository from '../app/repositories/menu_repository.js'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(AuthRepository, () => {
      return new AuthRepository()
    })
    this.app.container.singleton(menuRepository, () => {
      return new menuRepository()
    })
    this.app.container.singleton(orderRepository, () => {
      return new orderRepository()
    })
    this.app.container.singleton(reservationRepository, () => {
      return new reservationRepository()
    })
    this.app.container.singleton(tableRepository, () => {
      return new tableRepository()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
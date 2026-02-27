import { HttpContext } from '@adonisjs/core/http'
import { 
  createReservationValidator, 
  updateReservationStatusValidator, 
  availabilityValidator, 
  reservationQueryValidator } from '#validators/reservation_validator'
import { paginationValidator } from '#validators/common_validator'
import reservationRepository from '../repositories/reservation_repository.js'

export default class ReservationsController {

  protected repository = new reservationRepository()

  async checkAvailability({ request }: HttpContext) {
    const payload = await request.validateUsing(availabilityValidator)
    const availableTables = await this.repository.availabilityCheck(payload)
    return {
      status:true,
      availableTables
    }
  }

  async store({ user, request }: HttpContext) {
    const payload = await request.validateUsing(createReservationValidator)
    const reservation = await this.repository.createReservation(payload,user!)
    return {
      status:true,
      reservation
    }
  }

  async index({ request }: HttpContext) {
      const payload = await request.validateUsing(reservationQueryValidator)
      const reservations = await this.repository.listReservationByDate(payload)
      return {
        status:true,
        reservations
      }
  }

  async myReservations({ user, request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)

    const reservations = await this.repository.listMyReservation(params,user!)
    return {
      status:true,
      reservations
    }
  }

  async updateStatus({ request }: HttpContext) {
    const payload = await request.validateUsing(updateReservationStatusValidator)
    const reservation = await this.repository.updateReservationStatus(payload)
    return { 
      status:true,
      message: 'Status updated', 
      reservation 
    }
  }
}
import { HttpContext } from '@adonisjs/core/http'
import { 
  createReservationValidator, 
  updateReservationStatusValidator, 
  availabilityValidator, 
  reservationQueryValidator } from '#validators/reservation_validator'
import { paginationValidator } from '#validators/common_validator'
import reservationRepository from '../repositories/reservation_repository.js'
import ReservationEntity from '../domains/reservation_domain.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ReservationsController {

constructor(protected repository: reservationRepository) {}

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
    const rawReservation = await this.repository.createReservation(payload, user!)
    const reservation = new ReservationEntity(rawReservation).toJSON()
    return {
      status:true,
      reservation
    }
  }

  async index({ request }: HttpContext) {
    const payload = await request.validateUsing(reservationQueryValidator)
    const reservations = (await this.repository.listReservationByDate(payload)).toJSON()
    const verifiedData = ReservationEntity.fromCollection(reservations.data)
    return {
      status:true,
      reservations: {
        meta: reservations.meta,
        data: verifiedData
      }
    }
  }

  async myReservations({ user, request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const reservations = (await this.repository.listMyReservation(params,user!)).toJSON()
    const verifiedData = ReservationEntity.fromCollection(reservations.data)
    return {
      status:true,
      reservations:{
        meta: reservations.meta,
        data: verifiedData
      }
    }
  }

  async updateStatus({ request }: HttpContext) {
    const payload = await request.validateUsing(updateReservationStatusValidator)
   const rawReservation = await this.repository.updateReservationStatus(payload)
    
    const reservation = new ReservationEntity(rawReservation).toJSON()
    
    return { 
      status: true,
      message: 'Status updated', 
      reservation
    }
  }
}
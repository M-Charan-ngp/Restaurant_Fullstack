import Reservation from "#models/reservation";
import Table from "#models/table";
import User from "#models/user";
import { paginationDataDto } from "#validators/common_validator";
import { availabilityDataDto, reservationDataDto, reservationQueryDataDto, updateReservationStatusDto } from "#validators/reservation_validator";
import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";

export default class reservationRepository{

    async listMyReservation(payload:paginationDataDto,user:User){
        const reservations = await Reservation.query()
            .where('user_id', user!.id)
            .orderBy('time_slot', 'desc')
            .preload('table') 
            .preload('order', (q) => {
              q.preload('items', (iq) => iq.preload('menuItem')) 
            })
            .paginate(payload.page, payload.limit)
        return reservations
    }
    async listReservationByDate(payload:reservationQueryDataDto){
        const selectedDate = payload.date || DateTime.now().toISODate()
            const reservations = await Reservation.query()
                .where('reservation_date', selectedDate!)
                .preload('user', (q) => q.select('id', 'fullName', 'phoneNumber'))
                .preload('table')
                .preload('order')
                .orderBy('time_slot', 'asc')
                .paginate(payload.page, payload.limit)
            return reservations   
    }

    async updateReservationStatus(payload:updateReservationStatusDto){
        const reservation = await Reservation.findOrFail(payload.params.id)
        reservation.status = payload.status
        await reservation.save()
        return reservation;
    }

    async availabilityCheck(payload:availabilityDataDto){
        const requestedStart = payload.timeSlot
        const requestedEnd = DateTime.fromFormat(payload.timeSlot, 'HH:mm').plus({ hours: 2 }).toFormat('HH:mm')
        
        const busyTables = await db
            .from('reservations')
            .select('table_id')
            .where('reservation_date', payload.date)
            .whereNot('status', 'cancelled')
            .where((query) => {
              query
                .whereRaw('time_slot < ?', [requestedEnd])
                .andWhereRaw('time_slot_end > ?', [requestedStart])
            })
        const bookedTableIds = busyTables.map((r) => r.table_id)
        const availableTables = await Table.query()
            .whereNotIn('id', bookedTableIds)
            .where('is_available',true)
            .where('capacity', '>=', payload.guests)
        return availableTables
    }

    async createReservation(payload:reservationDataDto, user:User){
        const startTime = DateTime.fromFormat(payload.timeSlot, 'HH:mm')
        const endTime = startTime.plus({ hours: 2 })
        
        const conflict = await Reservation.query()
            .where('table_id', payload.tableId)
            .where('reservation_date', payload.reservationDate)
            .whereNot('status', 'cancelled')
            .where((query) => {
              query
                .whereRaw('time_slot < ?', [endTime.toFormat('HH:mm')])
                .andWhereRaw('time_slot_end > ?', [payload.timeSlot])
            })
            .first()
        
        if (conflict) {
            throw new Error('This table is occupied during part of your selected time.'), {
                                    code: 409,
                                    status: 'ALREADY_BOOKED'
                                };
        }
        
        const reservation = await Reservation.create({
            ...payload,
            userId: user!.id,
            reservationDate: DateTime.fromISO(payload.reservationDate),
            timeSlotEnd: endTime.toFormat('HH:mm'),
            status: 'pending'
        })
        return reservation
    }
}
import Table from '#models/table'
import { HttpContext } from '@adonisjs/core/http'
import { createTableValidator, updateTableValidator } from '#validators/table_validator'
import { paginationValidator } from '#validators/common_validator'
import { availabilityValidator } from '#validators/table_validator'

export default class TablesController {
  async index({ request }: HttpContext) {
    const {page, limit} = await request.validateUsing(paginationValidator)
    const tables = await Table.query()
      .where('is_available', true)
      .orderBy('table_number', 'asc')
      .paginate(page, limit)
    return {
      status:true,
      tables
    }
  }
  
  async adminIndex({ request }: HttpContext) {
    const { page, limit } = await request.validateUsing(paginationValidator)
    const tables = await Table.query()
      .orderBy('table_number', 'asc')
      .paginate(page, limit)

    return {
      status:true,
      tables
    }
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createTableValidator)
    const table = await Table.create(payload)
    
    return { 
      status:true,
      message: 'Table added successfully', 
      table }
  }

  async update({ params, request }: HttpContext) { 
    const payload = await request.validateUsing(updateTableValidator, {
        meta: { tableId: params.id }
    })
    const table = await Table.findOrFail(params.id)
    table.merge(payload)
    await table.save()
    
    return { 
      status:true,
      message: 'Table updated successfully', 
      table 
    }
  }

  async toggleAvailability({request}: HttpContext){
    const {params} = await request.validateUsing(availabilityValidator)
    const table = await Table.findOrFail(params.id)
    table.isAvailable = !table.isAvailable;
    await table.save()
    return {
      status: true,
      message: `Item is now ${table.isAvailable ? 'available' : 'unavailable'}`,
    }
  }
}
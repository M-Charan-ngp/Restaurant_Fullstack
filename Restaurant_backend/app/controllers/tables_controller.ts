import Table from '#models/table'
import { HttpContext } from '@adonisjs/core/http'
import { createTableValidator, updateTableValidator } from '#validators/table_validator'
import { paginationValidator } from '#validators/common_validator'

export default class TablesController {

  async index({ response }: HttpContext) {
    
    const tables = await Table.query()
      .orderBy('table_number', 'asc')
      
    return response.ok(tables)
  }
  
  async adminIndex({ request, response }: HttpContext) {
    const { page = 1, limit = 20 } = await request.validateUsing(paginationValidator)
    const tables = await Table.query()
      .orderBy('table_number', 'asc')
      .paginate(page, limit)

    return response.ok(tables)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTableValidator)
    const table = await Table.create(payload)
    
    return response.created({ message: 'Table added successfully', table })
  }

  async update({ params, request, response }: HttpContext) {
    const table = await Table.findOrFail(params.id)
    const payload = await request.validateUsing(updateTableValidator, {
        meta: { tableId: table.id }
    })
    table.merge(payload)
    await table.save()
    
    return response.ok({ message: 'Table updated successfully', table })
  }
}
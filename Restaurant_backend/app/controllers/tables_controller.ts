import { HttpContext } from '@adonisjs/core/http'
import { createTableValidator, updateTableValidator, availabilityValidator  } from '#validators/table_validator'
import { paginationValidator } from '#validators/common_validator'
import tableRepository from '../repositories/table_repository.js'

export default class TablesController {
  protected repository = new tableRepository()

  async index({ request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const tables = await this.repository.listTables(params)
    return {
      status:true,
      tables
    }
  }
  
  async adminIndex({ request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const tables = await this.repository.adminListTables(params)
    return {
      status:true,
      tables
    }
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createTableValidator)
    const table = await this.repository.createTable(payload)

    return { 
      status:true,
      message: 'Table added successfully', 
      table 
    }
  }

  async update({ params, request }: HttpContext) { 
    const payload = await request.validateUsing(updateTableValidator, {
        meta: { tableId: params.id }
    })
    const table = await this.repository.updateTable(payload)
  
    return { 
      status:true,
      message: 'Table updated successfully', 
      table 
    }
  }

  async toggleAvailability({request}: HttpContext){
    const {params} = await request.validateUsing(availabilityValidator)
    const table = await this.repository.toggleAvailbilityStatus(params.id)
    return {
      status: true,
      message: `Item is now ${table.isAvailable ? 'available' : 'unavailable'}`,
    }
  }
}
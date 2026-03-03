import { HttpContext } from '@adonisjs/core/http'
import { createTableValidator, updateTableValidator, availabilityValidator  } from '#validators/table_validator'
import { paginationValidator } from '#validators/common_validator'
import tableRepository from '../repositories/table_repository.js'
import TableEntity from '../domains/table_domain.js'
import { inject } from '@adonisjs/core'

@inject()
export default class TablesController {
constructor(protected repository: tableRepository) {}

  async index({ request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const tables = (await this.repository.listTables(params)).toJSON()
    const verifiedData = TableEntity.fromCollection(tables.data)
    
    return {
      status: true,
      tables: {
        meta: tables.meta,
        data: verifiedData
      }
    }
  }
  
  async adminIndex({ request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const tables = (await this.repository.adminListTables(params)).toJSON()
    const verifiedData = TableEntity.fromCollection(tables.data)

    return {
      status: true,
      tables: {
        meta: tables.meta,
        data: verifiedData
      }
    }
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createTableValidator)
    const rawTable = await this.repository.createTable(payload)
    
    const table = new TableEntity(rawTable).toJSON()
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
    const rawTable = await this.repository.updateTable(payload)
    const table = new TableEntity(rawTable).toJSON()
  
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
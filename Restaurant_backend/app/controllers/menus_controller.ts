import { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator, availabilityToggleValidator } from '#validators/menu_validator'
import { paginationValidator } from '#validators/common_validator'
import menuRepository from '../repositories/menu_repository.js'

export default class MenuController {
  protected repository = new menuRepository()

  async index({request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const items = await this.repository.listMenu(params)
    return {
      status: true,
      items
    }
  }

  async adminIndex({request}: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const items = await this.repository.adminListMenu(params)
    return {
      status:true,
      items
    }
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createMenuValidator)
    const item = await this.repository.createMenu(payload)
    return {
      status:true,
      message: 'Menu item created successfully',
      item
    }
  }

  async update({ params, request }: HttpContext) {
    
    const payload = await request.validateUsing(updateMenuValidator, {
      meta: { itemId: params.id }
    })
    const item = this.repository.updateMenu(payload)
    return {
      status:true,
      message: 'Menu item updated successfully',
      item
    }
  }
 
  async toggleAvailability({ request }: HttpContext) {
    const { params } = await request.validateUsing(availabilityToggleValidator)
    const item = await this.repository.updateAvailability(params.id)
    return {
      status:true,
      message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`,
      item
    }
  }
}
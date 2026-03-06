import { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator, menuImageValidator, availabilityToggleValidator } from '#validators/menu_validator'
import { paginationValidator } from '#validators/common_validator'
import menuRepository from '../repositories/menu_repository.js'
import { inject } from '@adonisjs/core'
import MenuEntity from '../domains/menu_domain.js'

@inject()
export default class MenuController {
constructor(protected repository: menuRepository) {}

  async index({request }: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const items = await this.repository.listMenu(params)
    const verifiedItems = MenuEntity.fromCollection(items.toJSON().data)
    return {
      status: true,
      items: {
        ...items.toJSON(),
        data: verifiedItems
      }
    }
  }

  async adminIndex({request}: HttpContext) {
    const params = await request.validateUsing(paginationValidator)
    const items = await this.repository.adminListMenu(params)
    const verifiedItems = MenuEntity.fromCollection(items.toJSON().data)
    return {
      status:true,
      items: {
        ...items.toJSON(),
        data: verifiedItems
      }
    }
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createMenuValidator)
    const rawItem = await this.repository.createMenu(payload)
    const item = new MenuEntity(rawItem)
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
    const rawItem = await this.repository.updateMenu(payload)
    const item = new MenuEntity(rawItem).toJSON()
    return {
      status:true,
      message: 'Menu item updated successfully',
      item
    }
  }
  async addImage({ request }:HttpContext){
    const payload = await request.validateUsing(menuImageValidator)
    const updatedMenu = await this .repository.updateMenuImage(payload.menu_image,payload.params.id)
    const item = new MenuEntity(updatedMenu)
    return{
      status: true,
      message: 'Image Added Successfully',
      user: item
    }
  }
 
  async toggleAvailability({ request }: HttpContext) {
    const { params } = await request.validateUsing(availabilityToggleValidator)
    const rawItem = await this.repository.updateAvailability(params.id)
    const item = new MenuEntity(rawItem)
    return {
      status:true,
      message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`,
      item
    }
  }
}
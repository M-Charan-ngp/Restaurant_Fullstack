import MenuItem from '#models/menu_item'
import { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator } from '#validators/menu_validator'
import { paginationValidator } from '#validators/common_validator'

export default class MenuController {

  async index({request }: HttpContext) {
    const { page = 1, limit = 12 } = await request.validateUsing(paginationValidator)
    const items = await MenuItem.query()
      .where('is_available', true)
      .orderBy('category', 'asc')
      .paginate(page, limit)

    return {
      status: true,
      items
    }
  }

  async adminIndex({request}: HttpContext) {
    const { page = 1, limit = 20 } = await request.validateUsing(paginationValidator)
    console.log(page,limit);
    const items = await MenuItem.query().orderBy('category', 'asc').paginate(page,limit)
    return {
      status:true,
      items
    }
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createMenuValidator)
    const item = await MenuItem.create(payload)

    return {
      status:true,
      message: 'Menu item created successfully',
      item
    }
  }

  async update({ params, request }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    const payload = await request.validateUsing(updateMenuValidator, {
      meta: { itemId: item.id }
    })

    item.merge(payload)
    await item.save()

    return {
      status:true,
      message: 'Menu item updated successfully',
      item
    }
  }
 
  async toggleAvailability({ params}: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    item.isAvailable = !item.isAvailable
    await item.save()

    return {
      status:true,
      message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`,
      item
    }
  }
}
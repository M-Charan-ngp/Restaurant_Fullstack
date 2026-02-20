// app/controllers/menu_controller.ts
import MenuItem from '#models/menu_item'
import { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator } from '#validators/menu_validator'
import { paginationValidator } from '#validators/common_validator'

export default class MenuController {

  async index({request, response }: HttpContext) {
    const { page = 1, limit = 12 } = await request.validateUsing(paginationValidator)
    const items = await MenuItem.query()
      .where('is_available', true)
      .orderBy('category', 'asc')
      .paginate(page, limit)

    return response.ok(items)
  }

  async adminIndex({request, response }: HttpContext) {
    const { page = 1, limit = 20 } = await request.validateUsing(paginationValidator)
    const items = await MenuItem.query().orderBy('category', 'asc').paginate(page,limit)
    return response.ok(items)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createMenuValidator)
    const item = await MenuItem.create(payload)

    return response.created({
      message: 'Menu item created successfully',
      item,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    const payload = await request.validateUsing(updateMenuValidator, {
      meta: { itemId: item.id }
    })

    item.merge(payload)
    await item.save()

    return response.ok({
      message: 'Menu item updated successfully',
      item,
    })
  }
 
  async toggleAvailability({ params, response }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    item.isAvailable = !item.isAvailable
    await item.save()

    return response.ok({
      message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`,
      item,
    })
  }
}
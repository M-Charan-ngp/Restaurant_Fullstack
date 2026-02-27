import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createMenuValidator = vine.compile(
  vine.object({
    name: vine.string().trim().unique({ table: 'menu_items', column: 'name' }),
    description: vine.string().trim().maxLength(255).optional(),
    price: vine.number().positive(),
    category: vine.string().trim().minLength(2),
    isAvailable: vine.boolean().optional()
  })
)
export const availabilityToggleValidator = vine.compile(
  vine.object({
    params: vine.object({
      id:vine.number().exists(async(db,value)=>{
        const match = await db.from('menu_items').where('id',value).first()
        return !!match
      })
    })
  })
)
export const updateMenuValidator = vine.compile(
  vine.object({
    params: vine.object({
      id:vine.number().exists(async (db,value) => {
        const match = await db.from('menu_items').where('id',value).first()
        return !!match
      })
    }),
    name: vine.string().trim().unique(async (db, value, field) => {
      const item = await db
        .from('menu_items')
        .whereNot('id', field.meta.itemId)
        .where('name', value)
        .first()
      return !item
    }).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    price: vine.number().positive().optional(),
    category: vine.string().trim().minLength(2).optional(),
    isAvailable: vine.boolean().optional()
  })
)

export type MenuDataDto = Infer<typeof createMenuValidator>
export type UpdateMenuDataDto = Infer<typeof updateMenuValidator>
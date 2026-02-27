import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createTableValidator = vine.compile(
  vine.object({
    tableNumber: vine.string().trim()
    .unique({ table: 'tables', column: 'table_number' }),
    capacity: vine.number().min(1).max(20),
  })
)

export const availabilityValidator = vine.compile(
  vine.object({
    params: vine.object({
      id:vine.number().exists(async (db,value) => {
        const match = await db.from('tables').where('id',value).first()
        return !!match
      })
    })
  })
)
export const updateTableValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists(async (db, value) => {
      const match = await db.from('tables').where('id', value).first()
      return !!match
    }), 
    }),
    tableNumber: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const table = await db
          .from('tables')
          .whereNot('id', field.meta.tableId) 
          .where('table_number', value)
          .first()
        return !table 
      })
      .optional(),
    capacity: vine.number().min(1).max(20).optional(),
  })
)
export type tableDataDto = Infer<typeof createTableValidator>
export type availableTableDataDto = Infer<typeof availabilityValidator>
export type UpdateTableDataDto = Infer<typeof updateTableValidator>

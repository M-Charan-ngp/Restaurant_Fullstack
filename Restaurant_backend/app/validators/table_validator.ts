import vine from '@vinejs/vine'

/**
 * Validator for creating a new table
 */
export const createTableValidator = vine.compile(
  vine.object({
    tableNumber: vine.string().trim()
    .unique({ table: 'tables', column: 'table_number' }),
    capacity: vine.number().min(1).max(20),
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
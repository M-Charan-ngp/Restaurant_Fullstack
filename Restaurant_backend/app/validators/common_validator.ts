import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().positive().parse((value) => value ?? 1),
    limit: vine.number().positive().max(100).parse((value) => value ?? 10),
    category: vine.string().parse((value) => value ?? 'All'),
  })
)

export type paginationDataDto = Infer<typeof paginationValidator>
import vine from '@vinejs/vine'

export const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().positive().parse((value) => value ?? 1),
    limit: vine.number().positive().max(100).parse((value) => value ?? 10),
  })
)
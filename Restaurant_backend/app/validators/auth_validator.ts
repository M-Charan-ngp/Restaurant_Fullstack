import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(50),
    email: vine.string().email().trim().toLowerCase().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(32),
    phoneNumber: vine.string().mobile().unique({ table: 'users', column: 'phone_number' }),
    roleId: vine.number().optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string(),
  })
)
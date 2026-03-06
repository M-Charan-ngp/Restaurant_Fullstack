import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

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

export const profilePictureValidator = vine.compile(
  vine.object({
    profile_picture: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export type UserDataDto = Infer<typeof signupValidator>
export type LoginDataDto = Infer<typeof loginValidator>
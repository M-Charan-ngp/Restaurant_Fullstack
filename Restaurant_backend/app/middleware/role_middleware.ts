import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {

  async handle(ctx: HttpContext, next: NextFn, allowedRoles: number[]) {
    const user = ctx.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Authentication required' })
    }
    if (!allowedRoles.includes(user.roleId)) {
      return ctx.response.forbidden({ 
        message: 'Access denied: You do not have the required permissions.' 
      })
    }
    return next()
  }
}
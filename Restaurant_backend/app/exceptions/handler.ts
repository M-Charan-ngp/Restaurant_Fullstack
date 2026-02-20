// app/exceptions/handler.ts
import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * Show stack traces only when NOT in production
   */
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    // 1. Validation Errors (VineJS)
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(error.status).send({
        status: false,
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    // 2. Resource Not Found (Lucid findOrFail)
    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send({
        status: false,
        message: 'The requested resource (Table, Order, or Menu Item) does not exist.',
      })
    }

    // 3. Database Conflict (Duplicate Entry)
    // Useful for unique table_number or email
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      return ctx.response.status(409).send({
        status: false,
        message: 'This record already exists in our system.',
      })
    }

    // 4. JWT Authentication Errors
    const jwtErrors = ['TokenExpiredError', 'JsonWebTokenError']
    if (jwtErrors.includes(error.name) || error.status === 401) {
      return ctx.response.status(401).send({
        status: false,
        code: error.name === 'TokenExpiredError' ? 'E_JWT_EXPIRED' : 'E_UNAUTHORIZED',
        message: error.name === 'TokenExpiredError' 
          ? 'Session expired. Please login again.' 
          : 'Invalid or missing authentication token.',
      })
    }

    // 5. Forbidden Access (Role Middleware failures)
    if (error.status === 403) {
      return ctx.response.status(403).send({
        status: false,
        message: 'Access denied: You do not have permission for this action.',
      })
    }

    // 6. Generic Internal Errors
    const status = error.status || 500
    return ctx.response.status(status).send({
      status: false,
      message: this.debug ? error.message : 'An unexpected server error occurred.',
      ...(this.debug && { stack: error.stack }),
    })
  }
}
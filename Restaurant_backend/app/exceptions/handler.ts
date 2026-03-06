// app/exceptions/handler.ts
import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import { errors as lucidErrors } from '@adonisjs/lucid'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
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
    // 2. Login Invalid Credentials
    if(error.message === "Invalid Credentials"){
      return ctx.response.status(401).send({
        status: false,
        message: 'Invalid Credentials'
      })
    }
    if (error.status === 'ALREADY_BOOKED' || error.status === "ALREADY_ORDERED" || error.code === 409) {
      return ctx.response.status(409).send({
        status: false,
        message: error.message
      })
    }
    if(error.status === "BAD_REQUEST"){
      console.log(error)
      return ctx.response.status(400).send({
        status: false,
        message: error.message
      })
    }
    // Domain Errors
    if (error.code === 'DOMAIN_ERROR') {
      return ctx.response.status(500).send({
        status: false,
        code: error.code,
        message: error.message,
      })
    }
    if(error.status === "INVALID_CREDENTIALS"){
      return ctx.response.status(401).send({
        status: false,
        message: error.message
      })
    }
    // 3. Database Connection Issues
    if (error.code === 'ECONNREFUSED' || error.code === 'EREQUEST') {
      logger.error('DATABASE CONNECTION LOST')
      return ctx.response.status(503).send({
        status: false,
        message: 'The database is currently unreachable.',
      })
    }
    // 4. Resource Not Found (Lucid findOrFail)
    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send({
        status: false,
        message: 'The requested resource (Table, Order, or Menu Item) does not exist.',
      })
    }

    // 5. Database Conflict
    if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
      return ctx.response.status(409).send({
        status: false,
        message: 'This record already exists in our system.',
      })
    }
    // 6. JWT Specific: Invalid/Tampered
    if (error.name === 'JsonWebTokenError') {
      return ctx.response.status(401).send({
        status: false,
        code: 'E_INVALID_JWT',
        message: 'Invalid authentication token.',
      })
    }
    // 7. JWT Authentication Errors
    if (error.name === 'TokenExpiredError' || error.code === 'E_JWT_EXPIRED') {
      return ctx.response.status(401).send({
        status: false,
        code: 'E_JWT_EXPIRED',
        message: 'Session expired. Please login again.',
      })
    }
    // 8. Missing Routes
    if (error.code === 'E_ROUTE_NOT_FOUND' || error.status === 404) {
      return ctx.response.status(404).send({
        status: false,
        message: 'The requested URL route does not exist.',
      })
    }
    // 9. Forbidden Access (Role Middleware failures)
    if (error.status === 403) {
      return ctx.response.status(403).send({
        status: false,
        message: 'Access denied: You do not have permission for this action.',
      })
    }

    // 10. Generic Internal Errors
    const status = error.status || 500
    return ctx.response.status(status).send({
      status: false,
      message: this.debug ? error.message : 'An unexpected server error occurred.',
      ...(this.debug && { stack: error.stack }),
    })
  }
}
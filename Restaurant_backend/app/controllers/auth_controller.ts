
import { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginValidator } from '#validators/auth_validator'
import AuthRepository from '../repositories/auth_repository.js'

export default class AuthController {
  protected repository = new AuthRepository()

  async signup({ request }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await this.repository.createUser(payload)
    return {
      status: true,
      message: 'Account created successfully',
      user: { 
        name: user.fullName, 
        email: user.email, 
        role: user.roleId 
      }
    }
  }

  async login({ request }: HttpContext) {
    const Credentials = await request.validateUsing(loginValidator)
    const token = await this.repository.loginUser(Credentials)
    return {
      status:true,
      message: 'Login successful',
      token: token,
    }
  }
}
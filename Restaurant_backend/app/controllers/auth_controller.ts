import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { JwtService } from '#services/jwt_service'
import { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginValidator } from '#validators/auth_validator'

export default class AuthController {

  async signup({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const hashedPassword = await hash.make(payload.password)
    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      phoneNumber: payload.phoneNumber,
      roleId: payload.roleId || 1
    })

    return response.created({
      message: 'Account created successfully',
      user: { 
        name: user.fullName, 
        email: user.email, 
        role: user.roleId 
      }
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.findBy('email', email)
    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
    
    const token = JwtService.sign({ 
      id: user.id, 
      name: user.fullName, 
      role: user.roleId
    })

    return {
      message: 'Login successful',
      token: token,
    }
  }
}
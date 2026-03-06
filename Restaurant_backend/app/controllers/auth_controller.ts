
import { HttpContext } from '@adonisjs/core/http'
import { signupValidator, loginValidator, profilePictureValidator } from '#validators/auth_validator'
import AuthRepository from '../repositories/auth_repository.js'
import { inject } from '@adonisjs/core'
import UserEntity from '../domains/auth_domain.js'
import User from '#models/user'

@inject()
export default class AuthController {
constructor(protected repository: AuthRepository) {}

  async signup({ request }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const user = await this.repository.createUser(payload)
    const userDomain = new UserEntity(user)
    return {
      status: true,
      message: 'Account created successfully',
      userDomain
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

  async uploadProfile({ user, request }: HttpContext) {
    const payload = await request.validateUsing(profilePictureValidator)
    const image = payload.profile_picture
    const updatedUser = await this.repository.updateProfilePicture(user as User, image)
    const verifiedUser = new UserEntity(updatedUser).toJSON()
    return {
      status: true,
      message: 'Profile picture updated',
      user: verifiedUser
    }
  }
  
  async myDetails({ user }: HttpContext) {
    const verifiedUser = new UserEntity(user).toJSON()
    return {
      status: true,
      user: verifiedUser
    }
  }
}
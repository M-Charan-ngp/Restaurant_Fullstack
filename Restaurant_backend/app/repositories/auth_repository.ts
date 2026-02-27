import User from '#models/user'
import { JwtService } from '#services/jwt_service'
import hash from '@adonisjs/core/services/hash'
import { UserDataDto, LoginDataDto } from '#validators/auth_validator'

export default class AuthRepository {

  async createUser(payload:UserDataDto){
    const hashedPassword = await hash.make(payload.password)
    const user = await User.create({
          fullName: payload.fullName,
          email: payload.email,
          password: hashedPassword,
          phoneNumber: payload.phoneNumber,
          roleId: payload.roleId || 1
        })
        return user;
  }

  async loginUser(Credentials:LoginDataDto){
    const user = await User.findBy('email', Credentials.email)
    if (!user) {
      throw new Error('Invalid Credentials')
    }
    const isPasswordValid = await hash.verify(user.password, Credentials.password)
    if (!isPasswordValid) {
      throw new Error('Invalid Credentials')
    }
    const token = JwtService.sign({ 
      id: user.id, 
      name: user.fullName, 
      role: user.roleId
    })
    return token
  }
}
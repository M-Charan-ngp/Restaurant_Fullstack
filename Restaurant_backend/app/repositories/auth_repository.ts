import User from '#models/user'
import { JwtService } from '#services/jwt_service'
import hash from '@adonisjs/core/services/hash'
import { UserDataDto, LoginDataDto } from '#validators/auth_validator'
import { cuid } from '@adonisjs/core/helpers'
import { readFile } from 'node:fs/promises'
import drive from '@adonisjs/drive/services/main'
import { Exception } from '@adonisjs/core/exceptions'

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
      throw new Exception('Invalid Credentials',{
        status:401,
        code:'INVALID_CREDENTIALS'
      })
    }
    const isPasswordValid = await hash.verify(user.password, Credentials.password)
    if (!isPasswordValid) {
      throw new Exception('Invalid Credentials',{
        status:401,
        code:'INVALID_CREDENTIALS'
      })
    }
    const token = JwtService.sign({ 
      id: user.id, 
      name: user.fullName, 
      role: user.roleId
    })
    return token
  }
async updateProfilePicture(user: User, image: any) {
    const fileName = `${cuid()}.${image.extname}`
    const key = `profiles/${fileName}`
    const disk = drive.use('fs')
    const fileBuffer = await readFile(image.tmpPath)
    if (user.profilePath) {
      const oldKey = user.profilePath.startsWith('/') ? user.profilePath.slice(1) : user.profilePath
      if (await disk.exists(oldKey)) {
        await disk.delete(oldKey)
      }
    }
    await disk.put(key, fileBuffer)
    user.profilePath = key
    await user.save()

    return user
  }
}
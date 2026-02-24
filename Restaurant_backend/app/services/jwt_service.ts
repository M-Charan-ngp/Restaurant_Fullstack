import jwt from 'jsonwebtoken'
import env from '#start/env'

export class JwtService {
  static sign(payload: any) {
    return jwt.sign(payload, env.get('APP_KEY'), { expiresIn: '10m' })
  }

  static verify(token: string) {
    try{
      return jwt.verify(token, env.get('APP_KEY'))
    }catch(error){
      throw error
    }
  }
}
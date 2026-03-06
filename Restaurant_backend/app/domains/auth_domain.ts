import { Exception } from "@adonisjs/core/exceptions"

export interface UserDomainData {
  id: number
  fullName: string
  email: string
  roleId: number
}

export default class UserEntity {
  public readonly id: number
  public readonly name: string
  public readonly email: string
  public readonly role: number
  public readonly profilePicture: string | null

  constructor(data: any) {
    if (!data.id || typeof data.id !== 'number') throw new Exception('Domain Error: Invalid User ID',{
      status:400,
      code:"DOMAIN_ERROR"
    })
    if (!data.email || typeof data.email !== 'string') throw new Exception('Domain Error: Invalid Email',{
      status:400,
      code:"DOMAIN_ERROR"
    })

    this.id = data.id
    this.name = data.fullName
    this.email = data.email
    this.role = Number(data.roleId)
    const backendUrl = 'http://localhost:3333'
    this.profilePicture = data.profilePath 
      ? `${backendUrl}/uploads/${data.profilePath}` 
      : null
    }
  

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
      profilePicture: this.profilePicture
      
    }
  }
}
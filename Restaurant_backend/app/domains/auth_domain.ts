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

  constructor(data: any) {
    if (!data.id || typeof data.id !== 'number') throw new Error('Domain Error: Invalid User ID')
    if (!data.email || typeof data.email !== 'string') throw new Error('Domain Error: Invalid Email')

    this.id = data.id
    this.name = data.fullName
    this.email = data.email
    this.role = Number(data.roleId)
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      role: this.role
    }
  }
}
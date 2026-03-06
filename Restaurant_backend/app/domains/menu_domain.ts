import { Exception } from "@adonisjs/core/exceptions"

export default class MenuEntity {
  public readonly id: number
  public readonly name: string
  public readonly category: string
  public readonly description: string | null
  public readonly price: number
  public readonly isAvailable: boolean
  public readonly imagePath: string | null

  constructor(data: any) {
    if (!data.id || typeof data.id !== 'number') throw new Exception('Domain Error: Invalid Item ID',{
      status:400,
      code:"DOMAIN_ERROR"
    })
    if (!data.name || typeof data.name !== 'string') throw new Exception('Domain Error: Invalid Item Name',{
      status:400,
      code:"DOMAIN_ERROR"
    })

    this.id = data.id
    this.name = data.name
    this.category = data.category || 'Uncategorized'
    this.description = data.description || null
    this.price = parseFloat(data.price)
    this.isAvailable = Boolean(data.isAvailable)
        const backendUrl = 'http://localhost:3333'
    this.imagePath = data.imagePath 
      ? `${backendUrl}/uploads/${data.imagePath}` 
      : null
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      description: this.description,
      price: this.price,
      isAvailable: this.isAvailable,
      imagePath: this.imagePath
    }
  }
  static fromCollection(items: any[]) {
    return items.map((item) => new MenuEntity(item).toJSON())
  }
}
export default class MenuEntity {
  public readonly id: number
  public readonly name: string
  public readonly category: string
  public readonly description: string | null
  public readonly price: number
  public readonly isAvailable: boolean

  constructor(data: any) {
    if (!data.id || typeof data.id !== 'number') throw new Error('Domain Error: Invalid Item ID')
    if (!data.name || typeof data.name !== 'string') throw new Error('Domain Error: Invalid Item Name')

    this.id = data.id
    this.name = data.name
    this.category = data.category || 'Uncategorized'
    this.description = data.description || null
    this.price = parseFloat(data.price)
    this.isAvailable = Boolean(data.isAvailable)
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      description: this.description,
      price: this.price,
      isAvailable: this.isAvailable
    }
  }
  static fromCollection(items: any[]) {
    return items.map((item) => new MenuEntity(item).toJSON())
  }
}
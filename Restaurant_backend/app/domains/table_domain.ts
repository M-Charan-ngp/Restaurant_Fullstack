export default class TableEntity {
  public readonly id: number
  public readonly tableNumber: string
  public readonly capacity: number
  public readonly isAvailable: boolean

  constructor(data: any) {
    if (!data.id) throw new Error('Domain Error: Invalid Table ID')

    this.id = data.id
    this.tableNumber = data.tableNumber
    this.capacity = Number(data.capacity)
    
    this.isAvailable = Boolean(data.isAvailable)
  }

  toJSON() {
    return {
      id: this.id,
      tableNumber: this.tableNumber,
      capacity: this.capacity,
      isAvailable: this.isAvailable,
    }
  }

  static fromCollection(tables: any[]) {
    return tables.map((table) => new TableEntity(table).toJSON())
  }
}
import { Exception } from "@adonisjs/core/exceptions"

export default class TableEntity {
  public readonly id: number
  public readonly tableNumber: string
  public readonly capacity: number
  public readonly isAvailable: boolean

  constructor(data: any) {
    if (!data.id) throw new Exception('Domain Error: Invalid Table ID',{
      status: 400,
      code:"DOMAIN_ERROR"
    })

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
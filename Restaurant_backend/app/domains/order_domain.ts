import MenuItem from "#models/menu_item"

export default class OrderEntity {
  public readonly id: number
  public readonly totalAmount: number
  public readonly status: string
  public readonly reservation: any
  public readonly items: MenuItem[]

  constructor(data: any) {
    if (!data.id) throw new Error('Domain Error: Invalid Order ID')
    
    this.id = data.id
    this.totalAmount = parseFloat(data.totalAmount)
    this.status = data.status
    
    
    this.reservation = data.reservation ? {
      date: data.reservation.reservationDate,
      timeSlot: data.reservation.timeSlot,
      timeSlotEnd: data.reservation.timeSlotEnd,
      table: data.reservation.table ? data.reservation.table.tableNumber : 'N/A'

    } : null

    this.items = Array.isArray(data.items) 
      ? data.items.map((item: any) => ({
          name: item.menuItem?.name || 'Unknown Item',
          quantity: item.quantity,
          price: parseFloat(item.unitPrice)
        }))
      : []
  }

  toJSON() {
    return {
      id: this.id,
      totalAmount: this.totalAmount,
      status: this.status,
      reservation: this.reservation,
      items: this.items,
      
    }
  }

  static fromCollection(orders: any[]) {
    return orders.map((order) => new OrderEntity(order).toJSON())
  }
}
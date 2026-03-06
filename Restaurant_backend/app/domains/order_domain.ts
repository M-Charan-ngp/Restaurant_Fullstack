import { Exception } from "@adonisjs/core/exceptions"

export default class OrderEntity {
  public readonly id: number
  public readonly totalAmount: number
  public readonly status: string
  public readonly reservation: {
    date: string
    timeSlot: string
    timeSlotEnd: string
    table: string
  } | null
  public readonly items: Array<{ name: string; quantity: number; price: number }>

  constructor(data: any) {
    if (!data.id || typeof data.id !== 'number') {
      throw new Exception('Domain Error: Invalid or missing Order ID', {
      status:400,
      code:"DOMAIN_ERROR"
    })
    }
    this.id = data.id
    this.status = typeof data.status === 'string' ? data.status : 'pending'
    const parsedAmount = parseFloat(data.totalAmount)
    this.totalAmount = isNaN(parsedAmount) ? 0 : parsedAmount
    this.reservation = data.reservation 
      ? {
          date: String(data.reservation.reservationDate || ''),
          timeSlot: String(data.reservation.timeSlot || ''),
          timeSlotEnd: String(data.reservation.timeSlotEnd || ''),
          table: data.reservation.table?.tableNumber 
                 ? String(data.reservation.table.tableNumber) 
                 : 'N/A'
        } 
      : null
    this.items = Array.isArray(data.items) 
      ? data.items.map((item: any) => {
          const qty = parseInt(item.quantity)
          const uprice = parseFloat(item.unitPrice)
          
          return {
            name: typeof item.menuItem?.name === 'string' ? item.menuItem.name : 'Unknown Item',
            quantity: isNaN(qty) ? 0 : qty,
            price: isNaN(uprice) ? 0 : uprice
          }
        })
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
export default class ReservationEntity {
    public readonly id: number
    public readonly date: string
    public readonly timeSlot: string
    public readonly timeSlotEnd: string
    public readonly guestCount: number
    public readonly status: string
    public readonly customer: string
    public readonly tableNumber: string | null

  constructor(data: any) {
    if (!data.id) throw new Error('Domain Error: Invalid Reservation ID')

    this.id = data.id
    this.date = data.reservationDate
    this.timeSlot = this.formatTime(data.timeSlot)
    this.timeSlotEnd = this.formatTime(data.timeSlotEnd)
    this.guestCount = Number(data.guestCount)
    this.status = data.status
    this.customer = data.user?.fullName
    this.tableNumber = data.table?.tableNumber
  }

  private formatTime(time: string): string {
    if (!time) return '00:00'
    return time.split(':').slice(0, 2).join(':')
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date.toString().split('T')[0],
      timeSlot: this.timeSlot,
      timeSlotEnd: this.timeSlotEnd,
      guestCount: this.guestCount,
      status: this.status,
      customer: this.customer ?? null,
      tableNumber: this.tableNumber,
    }
  }

  static fromCollection(reservations: any[]) {
    return reservations.map((res) => new ReservationEntity(res).toJSON())
  }
}
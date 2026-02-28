class Elevator {

  constructor() {
    // Pag gumawa ng bagong Elevator,
    // automatic na ire-reset lahat ng values
    this.reset()
  }

  reset() {
    // Starting state ng elevator

    this.currentFloor = 0      // Nasa lobby lagi pag start
    this.requests = []         // Mga taong naghihintay pa
    this.riders = []           // Mga taong nasa loob na
    this.floorsTraversed = 0   // Total floors na dinaanan
    this.stops = 0             // Ilang beses tumigil
    
  }

  moveUp() {
    // Tataas ng isang floor
    this.currentFloor++
    this.floorsTraversed++   // dagdag din sa total movement
  }

  moveDown() {
    // Bababa lang kung hindi pa nasa ground floor
    if (this.currentFloor > 0) {
      this.currentFloor--
      this.floorsTraversed++
    }
  }

  travelTo(targetFloor) {
    // Ito ang main movement logic
    // Aakyat or bababa hanggang marating targetFloor

    while (this.currentFloor < targetFloor) {
      this.moveUp()
    }

    while (this.currentFloor > targetFloor) {
      this.moveDown()
    }
  }

  hasStop() {
    // Check kung kailangan tumigil sa current floor
    // Either may naghihintay dito
    // or may bababa dito

    return this.requests.some(p => p.currentFloor === this.currentFloor)
      || this.riders.some(p => p.dropOffFloor === this.currentFloor)
  }

  hasPickup() {
    // Lahat ng requests na nasa current floor
    // papasukin sa elevator

    const entering = this.requests.filter(
      p => p.currentFloor === this.currentFloor
    )

    // Ilagay sila sa riders
    entering.forEach(p => this.riders.push(p))

    // Tanggalin sila sa waiting list
    this.requests = this.requests.filter(
      p => p.currentFloor !== this.currentFloor
    )
  }

  hasDropoff() {
    // Lahat ng riders na nasa dropoff floor na
    // tatanggalin sa elevator

    this.riders = this.riders.filter(
      p => p.dropOffFloor !== this.currentFloor
    )
  }

  goToFloor(person) {
    // Single person trip (used sa early tests)

    // Puntahan muna siya
    this.travelTo(person.currentFloor)
    this.stops++   // stop for pickup

    // Ihatid siya
    this.travelTo(person.dropOffFloor)
    this.stops++   // stop for dropoff
  }

  dispatch() {

  if (this.requests.length === 0) return

  // =============================
  // 1️⃣ PICKUP PHASE
  // =============================

  // Sort pickup floors pataas
  this.requests.sort((a, b) => a.currentFloor - b.currentFloor)

  this.requests.forEach(person => {
    this.travelTo(person.currentFloor)
    this.stops++
    this.riders.push(person)
  })

  this.requests = []

  // =============================
  // 2️⃣ DROPOFF PHASE (REAL FIX)
  // =============================

  if (this.riders.length > 0) {

    // Separate riders relative to currentFloor
    const above = this.riders
      .filter(r => r.dropOffFloor > this.currentFloor)
      .sort((a, b) => a.dropOffFloor - b.dropOffFloor)

    const below = this.riders
      .filter(r => r.dropOffFloor <= this.currentFloor)
      .sort((a, b) => b.dropOffFloor - a.dropOffFloor)

    const orderedDropoffs = [...above, ...below]

    orderedDropoffs.forEach(person => {
      this.travelTo(person.dropOffFloor)
      this.stops++
    })
  }

  // IMPORTANT: check return BEFORE clearing riders
  const shouldReturn = this.checkReturnToLoby()

  this.riders = []

  // =============================
  // 3️⃣ RETURN TO LOBBY
  // =============================

  if (shouldReturn) {
    this.travelTo(0)
  }
}

  checkReturnToLoby() {
    // Rule:
    // Kapag before 12PM
    // at walang riders
    // dapat bumalik sa lobby

    return new Date().getHours() < 12
      && this.riders.length === 0
  }

}

export default Elevator
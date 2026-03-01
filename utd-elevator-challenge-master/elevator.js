class Elevator {

  constructor() {
    this.reset()
  }

  reset() {
    this.currentFloor = 0
    this.requests = []
    this.riders = []
    this.floorsTraversed = 0
    this.stops = 0
  }

  moveUp() {
    this.currentFloor++
    this.floorsTraversed++
  }

  moveDown() {
    if (this.currentFloor > 0) {
      this.currentFloor--
      this.floorsTraversed++
    }
  }

  travelTo(targetFloor) {
    while (this.currentFloor < targetFloor) {
      this.moveUp()
    }

    while (this.currentFloor > targetFloor) {
      this.moveDown()
    }
  }

  hasStop() {
    return this.requests.some(p => p.currentFloor === this.currentFloor)
      || this.riders.some(p => p.dropOffFloor === this.currentFloor)
  }

  hasPickup() {
    const entering = this.requests.filter(
      p => p.currentFloor === this.currentFloor
    )

    entering.forEach(p => this.riders.push(p))

    this.requests = this.requests.filter(
      p => p.currentFloor !== this.currentFloor
    )
  }

  hasDropoff() {
    this.riders = this.riders.filter(
      p => p.dropOffFloor !== this.currentFloor
    )
  }

  // ✅ FIXED
  goToFloor(person) {
    // Pickup
    this.travelTo(person.currentFloor)
    this.stops++

    // Dropoff
    this.travelTo(person.dropOffFloor)
    this.stops++

    // Clear riders (single trip mode)
    this.riders = []

    // Return to lobby if needed
    if (this.checkReturnToLoby()) {
      this.travelTo(0)
    }
  }

  dispatch() {

    if (this.requests.length === 0) return

    // =============================
    // 1️⃣ PICKUP PHASE
    // =============================

    this.requests.sort((a, b) => a.currentFloor - b.currentFloor)

    this.requests.forEach(person => {
      this.travelTo(person.currentFloor)
      this.stops++
      this.riders.push(person)
    })

    this.requests = []

    // =============================
    // 2️⃣ DROPOFF PHASE
    // =============================

    if (this.riders.length > 0) {

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

    // ✅ FIX: clear riders BEFORE checking return
    this.riders = []

    const shouldReturn = this.checkReturnToLoby()

    // =============================
    // 3️⃣ RETURN TO LOBBY
    // =============================

    if (shouldReturn) {
      this.travelTo(0)
    }
  }

  checkReturnToLoby() {
    return new Date().getHours() < 12
      && this.riders.length === 0
  }

}

export default Elevator
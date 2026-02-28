import Elevator from "./elevator.js"

// ===============================
// INIT
// ===============================

const elevator = new Elevator("SCAN")
const building = document.getElementById("building")
const startBtn = document.getElementById("startBtn")

console.log("🚀 App initialized")

// ===============================
// BUILD FLOORS (10 floors)
// ===============================

for (let i = 9; i >= 0; i--) {
  const floor = document.createElement("div")
  floor.className = "floor"
  floor.innerText = "Floor " + i
  building.appendChild(floor)
}

console.log("🏢 Floors created")

// ===============================
// CREATE ELEVATOR BOX
// ===============================

const elevatorDiv = document.createElement("div")
elevatorDiv.className = "elevator"
building.appendChild(elevatorDiv)

console.log("🛗 Elevator DOM created")

function renderElevator() {
  console.log("📍 Rendering at floor:", elevator.currentFloor)
  elevatorDiv.style.bottom = elevator.currentFloor * 50 + "px"
}

// ===============================
// 🔥 API FUNCTIONS
// ===============================

// GET all requests
async function fetchRequests() {
  console.log("🌐 Fetching requests from backend...")
  const res = await fetch("http://localhost:3000/requests")
  const data = await res.json()
  elevator.requests = data
  console.log("📦 Requests received:", data)
}

// POST new request
async function createRequest(currentFloor, dropOffFloor) {
  console.log(`➕ Creating request: ${currentFloor} → ${dropOffFloor}`)
  await fetch("http://localhost:3000/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentFloor, dropOffFloor })
  })
}

// DELETE request
async function deleteRequest(id) {
  console.log("🗑 Deleting request ID:", id)
  await fetch(`http://localhost:3000/requests/${id}`, {
    method: "DELETE"
  })
}

// ===============================
// START SIMULATION
// ===============================

async function startSimulation() {

  console.log("▶️ Simulation started")
  startBtn.disabled = true

  elevator.reset()

  await createRequest(2, 8)
  await createRequest(5, 1)


  let direction = 1 // 1 = up, -1 = down

  const interval = setInterval(async () => {

  await fetchRequests() 

  console.log("📍 Floor:", elevator.currentFloor)
  console.log("📦 Requests:", elevator.requests.length)
  console.log("🧍 Riders:", elevator.riders.length)

  // PICKUP
  const hadPickup = elevator.requests.some(
    r => r.currentFloor === elevator.currentFloor
  )

  const pickupRequests = elevator.requests.filter(
  r => r.currentFloor === elevator.currentFloor
)

for (const req of pickupRequests) {
  console.log("🛑 PICKUP at", elevator.currentFloor)

  elevator.riders.push(req)

  await deleteRequest(req.id)

  // 🔥 REMOVE LOCALLY
  elevator.requests = elevator.requests.filter(
    r => r.id !== req.id
  )
}

  // DROPOFF
  const hadDropoff = elevator.riders.some(
    r => r.dropOffFloor === elevator.currentFloor
  )

  if (hadDropoff) {
    console.log("🛑 DROPOFF at", elevator.currentFloor)
    elevator.hasDropoff()
  }

  // 🛑 STOP CONDITION
  if (
    elevator.requests.length === 0 &&
    elevator.riders.length === 0 &&
    elevator.currentFloor === 0
  ) {
    console.log("✅ Simulation finished")
    clearInterval(interval)
    startBtn.disabled = false
    return
  }

  // CHANGE DIRECTION
  if (elevator.currentFloor === 9) direction = -1
  if (elevator.currentFloor === 0) direction = 1

  // MOVE
  if (direction === 1) {
    elevator.moveUp()
  } else {
    elevator.moveDown()
  }

  renderElevator()

}, 500)
}

// ===============================
// EVENT LISTENER
// ===============================

startBtn.addEventListener("click", startSimulation)
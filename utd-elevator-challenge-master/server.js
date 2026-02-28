import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

let requests = []
let riders = []

// CREATE request
app.post("/requests", (req, res) => {
  const request = req.body
  request.id = Date.now()
  requests.push(request)
  res.json(request)
})

// READ requests
app.get("/requests", (req, res) => {
  res.json(requests)
})

// DELETE request
app.delete("/requests/:id", (req, res) => {
  const id = parseInt(req.params.id)
  requests = requests.filter(r => r.id !== id)
  res.json({ message: "Deleted" })
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})
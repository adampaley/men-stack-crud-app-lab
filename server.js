require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")

const app = express()

// DB connection code
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// import model
const Oscar = require("./models/oscar.js")

// middleware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

// routes

// CREATE 
app.get("/", async (req, res) => {
    res.render("index.ejs")
})

app.get("/oscars/new", (req, res) => {
    res.render("oscars/new.ejs")
})

app.post("/oscars", async (req, res) => {
    if (req.body.isAnOscarWinner === "on") {
        req.body.isAnOscarWinner = true
    } else {
        req.body.isAnOscarWinner = false
    }
    await Oscar.create(req.body)
    res.redirect("/oscars")
})

// READ
app.get("/oscars", async (req, res) => {
    const allOscarWinners = await Oscar.find()
    res.render("oscars/index.ejs", { oscars: allOscarWinners })
})

app.get("/oscars/:actorId", async (req, res) => {
    const foundOscar = await Oscar.findById(req.params.actorId)
    res.render("oscars/show.ejs", { actor: foundOscar})
})

// UPDATE
app.get("/oscars/:actorId/edit", async (req, res) => {
    const foundOscar = await Oscar.findById(req.params.actorId)
    res.render("oscars/edit.ejs", {
        actor: foundOscar,
    })
})

app.put("/oscars/:actorId", async (req, res) => {
    if (req.body.isAnOscarWinner === "on") {
        req.body.isAnOscarWinner = true
    } else {
        req.body.isAnOscarWinner = false
    }
    await Oscar.findByIdAndUpdate(req.params.actorId, req.body)
    res.redirect(`/oscars/${req.params.actorId}`)
})

// DELETE
app.delete("/oscars/:actorId", async (req, res) => {
    await Oscar.findByIdAndDelete(req.params.actorId)
    res.redirect("/oscars")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
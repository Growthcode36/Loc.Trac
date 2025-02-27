const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi MongoDB
mongoose.connect("mongodb://localhost:27017/locationDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema MongoDB
const locationSchema = new mongoose.Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model("Location", locationSchema);

// API untuk menyimpan lokasi user
app.post("/save-location", async (req, res) => {
    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
        return res.status(400).json({ error: "Data tidak lengkap" });
    }

    try {
        const newLocation = new Location({ userId, latitude, longitude });
        await newLocation.save();
        res.json({ message: "Lokasi berhasil disimpan" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menyimpan lokasi" });
    }
});

// API untuk mendapatkan semua lokasi
app.get("/get-locations", async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data lokasi" });
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

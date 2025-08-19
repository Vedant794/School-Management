import express from "express";
import pool from "./db.js";
import { addSchoolSchema, listSchema } from "./validators.js";

const router = express.Router();

// POST /addSchool
router.post("/addSchool", async (req, res, next) => {
  try {
    const { error, value } = addSchoolSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }

    const { name, address, latitude, longitude } = value;
    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    const [rows] = await pool.execute("SELECT * FROM schools WHERE id = ?", [
      result.insertId,
    ]);
    return res.status(201).json({ status: "ok", data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /listSchools?lat=<>&lng=<>
router.get("/listSchools", async (req, res, next) => {
  try {
    const { error, value } = listSchema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }

    const userLat = parseFloat(value.lat);
    const userLng = parseFloat(value.lng);

    // Haversine formula in SQL to compute distance (in kilometers)
    const query = `
      SELECT
        id, name, address, latitude, longitude,
        (6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )) AS distance_km
      FROM schools
      ORDER BY distance_km ASC;
    `;

    const [rows] = await pool.execute(query, [userLat, userLng, userLat]);
    return res.json({ status: "ok", count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

export default router;

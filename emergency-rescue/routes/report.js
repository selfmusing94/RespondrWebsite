const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authenticate = require('../middleware/auth');
const pool = require('../config/database');
const path = require('path');
const fs = require('fs').promises;
const { assignToNearestDriver } = require('../services/geospatial');

router.post(
  '/create',
  authenticate('Public'),
  [
    check('type').isIn(['SOS', 'Booking']),
    check('latitude').isFloat({ min: -90, max: 90 }),
    check('longitude').isFloat({ min: -180, max: 180 }),
    check('description').optional().isString(),
    check('destination').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, latitude, longitude, description, destination } = req.body;
    let photoUrl = null;

    try {
      // Handle SOS photo upload
      if (type === 'SOS') {
        if (!req.files?.photo) return res.status(400).json({ error: 'Photo required for SOS' });

        const photo = req.files.photo;
        if (!['image/jpeg', 'image/png'].includes(photo.mimetype)) {
          return res.status(400).json({ error: 'Only JPEG/PNG allowed' });
        }
        if (photo.size > 5 * 1024 * 1024) {
          return res.status(400).json({ error: 'File too large' });
        }

        const fileName = `${Date.now()}_${photo.name}`;
        const filePath = path.join(__dirname, '../uploads', fileName);
        await photo.mv(filePath);
        photoUrl = `/uploads/${fileName}`;
      } else if (!destination) {
        return res.status(400).json({ error: 'Destination required for Booking' });
      }

      // Insert the report
      const [result] = await pool.query(
        `INSERT INTO reports (user_id, type, latitude, longitude, photo_url, description, destination, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
        [req.user.user_id, type, latitude, longitude, photoUrl, description, destination]
      );

      const reportId = result.insertId;

      try {
        // Try to assign ambulance
        const assigned = await assignToNearestDriver(reportId, {
          latitude,
          longitude,
          type,
          photoUrl,
          description
        });

        if (!assigned) {
          // No ambulance found – return conflict
          return res.status(409).json({ error: 'No available ambulances at the moment' });
        }

        // All good
        res.status(201).json({ message: 'Report created and assigned', reportId });

      } catch (assignErr) {
        // If assignToNearestDriver throws specific error
        if (assignErr.message === 'No available ambulances') {
          return res.status(409).json({ error: assignErr.message });
        }

        // Unknown error during assignment
        console.error('Assignment error:', assignErr);
        return res.status(500).json({ error: 'Error assigning ambulance', details: assignErr.message });
      }

    } catch (error) {
      console.error("Create report failed:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

module.exports = router;

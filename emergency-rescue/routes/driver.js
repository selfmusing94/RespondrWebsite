const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const pool = require('../config/database');
const { assignToNearestDriver } = require('../services/geospatial');

router.post('/assignment/:assignmentId', authenticate('Responder'), async (req, res) => {
  const { assignmentId } = req.params;
  const { action } = req.body;

  try {
    const [assignments] = await pool.query(
      `SELECT r.report_id, r.type, r.latitude, r.longitude, r.photo_url, r.description
       FROM report_assignments ra
       JOIN reports r ON ra.report_id = r.report_id
       WHERE ra.assignment_id = ? AND ra.driver_id = (SELECT driver_id FROM drivers WHERE user_id = ?)`,
      [assignmentId, req.user.user_id]
    );

    if (assignments.length === 0) return res.status(404).json({ error: 'Assignment not found' });

    const report = assignments[0];

    if (action === 'accept') {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        await connection.query(
          `UPDATE report_assignments SET status = 'Accepted', response_time = NOW() WHERE assignment_id = ?`,
          [assignmentId]
        );
        await connection.query(
          `UPDATE reports SET status = 'Assigned' WHERE report_id = ?`,
          [report.report_id]
        );
        const [ambulance] = await connection.query(
          `SELECT ambulance_id FROM ambulances WHERE driver_id = (SELECT driver_id FROM drivers WHERE user_id = ?)`,
          [req.user.user_id]
        );
        await connection.query(
          `INSERT INTO dispatch_records (ambulance_id, report_id, assignment_id, dispatch_status)
           VALUES (?, ?, ?, 'Dispatched')`,
          [ambulance[0].ambulance_id, report.report_id, assignmentId]
        );
        await connection.commit();
        res.json({ message: 'Assignment accepted' });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } else if (action === 'cancel') {
      await pool.query(
        `UPDATE report_assignments SET status = 'Cancelled', response_time = NOW() WHERE assignment_id = ?`,
        [assignmentId]
      );

      const [existingAssignments] = await pool.query(
        `SELECT COUNT(*) as count FROM report_assignments WHERE report_id = ?`,
        [report.report_id]
      );
      if (existingAssignments[0].count >= 3) {
        await pool.query(`UPDATE reports SET status = 'Cancelled' WHERE report_id = ?`, [report.report_id]);
        return res.json({ message: 'Assignment cancelled, report marked as unassignable' });
      }

      await assignToNearestDriver(report.report_id, {
        latitude: report.latitude,
        longitude: report.longitude,
        type: report.type,
        photoUrl: report.photo_url,
        description: report.description
      });

      res.json({ message: 'Assignment cancelled, reassigned' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/pending', authenticate('Responder'), async (req, res) => {
  try {
    const [reports] = await pool.query(
      `SELECT r.report_id, r.type, r.latitude, r.longitude, r.photo_url, r.description
       FROM reports r
       JOIN report_assignments ra ON r.report_id = ra.report_id
       WHERE r.status = 'Pending' AND ra.driver_id = (SELECT driver_id FROM drivers WHERE user_id = ?)`,
      [req.user.user_id]
    );
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
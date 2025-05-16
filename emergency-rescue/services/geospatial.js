const pool = require('../config/database');
const geolib = require('geolib');
const { sendNotificationToResponders } = require('./notification');

async function assignToNearestDriver(reportId, reportDetails) {
  const { latitude, longitude, type, photoUrl, description } = reportDetails;

  const [ambulances] = await pool.query(
    `SELECT a.ambulance_id, a.driver_id, a.latitude, a.longitude, d.status AS driver_status
     FROM ambulances a
     JOIN drivers d ON a.driver_id = d.driver_id
     WHERE a.status = 'Available' AND d.status = 'Available'`
  );

  if (ambulances.length === 0) throw new Error('No available ambulances');

  const nearest = ambulances.reduce((closest, ambulance) => {
    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: ambulance.latitude, longitude: ambulance.longitude }
    );
    return !closest || distance < closest.distance
      ? { ambulance, distance }
      : closest;
  }, null);

  const { driver_id } = nearest.ambulance;
  await pool.query(
    `INSERT INTO report_assignments (report_id, driver_id, status)
     VALUES (?, ?, 'Pending')`,
    [reportId, driver_id]
  );

  await sendNotificationToResponders({
    reportId,
    type,
    latitude,
    longitude,
    photoUrl,
    description
  });

  return driver_id;
}

module.exports = { assignToNearestDriver };
import clientPromise from './client.js';

/**
 * Upserts parsed WebKiosk dashboard data
 * @param {string} enrollmentNo - Student's enrollment number
 * @param {Object} dashboardData - Parsed full dashboard data
 */
export async function storeOrUpdateDashboard(enrollmentNo, dashboardData) {
  const client = await clientPromise;
  const db = client.db('webkiosk');
  const dashboard = db.collection('dashboard');

  await dashboard.updateOne(
    { enrollmentNo },
    {
      $set: {
        enrollmentNo,
        data: dashboardData
      },
      $setOnInsert: { createdAt: new Date() },
      $currentDate: { updatedAt: true }
    },
    { upsert: true }
  );
}

/**
 * Retrieves stored dashboard data for a student
 * @param {string} enrollmentNo
 * @returns {Object|null}
 */
export async function getDashboard(enrollmentNo) {
  const client = await clientPromise;
  const db = client.db('webkiosk');
  const dashboard = db.collection('dashboard');

  return dashboard.findOne({ enrollmentNo }, { projection: { _id: 0, data: 1, updatedAt: 1 } });
}

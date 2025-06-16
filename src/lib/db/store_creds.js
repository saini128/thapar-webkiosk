import clientPromise from './client';

export async function storeOrUpdateCreds({ enrollmentNo, password }) {
  const client = await clientPromise;
  const db = client.db('webkiosk');
  const users = db.collection('users');

  await users.updateOne(
    { enrollmentNo },
    {
      $set: { enrollmentNo, password },
      $setOnInsert: { createdAt: new Date() },
      $currentDate: { updatedAt: true }
    },
    { upsert: true }
  );
}

export async function getCreds(enrollmentNo) {
  const client = await clientPromise;
  const db = client.db('webkiosk');
  const users = db.collection('users');

  return users.findOne({ enrollmentNo }, { projection: { _id: 0, password: 1 } });
}
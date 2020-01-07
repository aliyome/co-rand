import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// interface AdminRoom {
//   password: string;
//   users: string[];
// }

export const enterSecureRoom = functions
  .region('asia-northeast1')
  .https.onCall(
    async ({ roomId, pass }: { roomId: string; pass: string }, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return false;
      }

      const adminRoomRef = db.doc(`admin-rooms/${roomId}`);
      const adminRoom = await adminRoomRef.get();
      if (pass !== adminRoom.get('password')) {
        return false;
      }

      await adminRoomRef.update({
        users: admin.firestore.FieldValue.arrayUnion(uid),
      });

      return true;
    },
  );

export const exitSecureRoom = functions
  .region('asia-northeast1')
  .https.onCall(async (roomId: string, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
      return false;
    }

    const adminRoomRef = db.doc(`admin-rooms/${roomId}`);
    const adminRoom = await adminRoomRef.get();
    const users = adminRoom.get('users') as string[];
    if (!users.includes(uid)) {
      return true;
    }

    await adminRoomRef.update({
      users: admin.firestore.FieldValue.arrayRemove(uid),
    });

    return true;
  });

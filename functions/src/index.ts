import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { randomBytes } from 'crypto';

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

const random = () => {
  const nBytes = 4;
  const maxValue = 4294967295;
  const b = randomBytes(nBytes);
  const r = b.readUIntBE(0, nBytes);
  const zeroToOne = r / (maxValue + 1);
  return zeroToOne;
};

const randN = (n: number) => Math.round(random() * n);

export const runRoulette = functions
  .region('asia-northeast1')
  .https.onCall(async (roomId: string, context) => {
    if (!context.auth) {
      throw Error('auth needed');
    }
    const rand = randN(6);
    const ref = db.doc(`rooms/${roomId}`);
    const history = { user: context.auth.uid, value: rand };
    await ref.update({
      history: admin.firestore.FieldValue.arrayUnion(history),
    });

    return rand;
  });

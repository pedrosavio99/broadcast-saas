import {setGlobalOptions} from "firebase-functions";
import {onSchedule} from "firebase-functions/scheduler";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";

initializeApp();
setGlobalOptions({maxInstances: 10});

export const processScheduledMessages = onSchedule(
  "every 1 minutes",
  async () => {
    const db = getFirestore();
    const now = Timestamp.now();

    const snapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) return;

    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "sent",
        sentAt: now,
      });
    });

    await batch.commit();
    console.log(`${snapshot.size} mensagem(ns) atualizada(s)`);
  }
);

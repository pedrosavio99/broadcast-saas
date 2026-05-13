import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { Message } from '../types';

const messagesRef = collection(db, 'messages');

export const messageService = {
  create: async (
    content: string,
    contacts: string[],
    connectionId: string,
    ownerId: string,
    scheduledAt?: Date,
  ) => {
    const newMessage = {
      content,
      contacts,
      connectionId,
      ownerId,
      status: scheduledAt ? 'scheduled' : 'sent',
      scheduledAt: scheduledAt ?? null,
      sentAt: scheduledAt ? null : new Date(),
      createdAt: new Date(),
    };
    const docRef = await addDoc(messagesRef, newMessage);
    return { id: docRef.id, ...newMessage };
  },

  subscribeToMessages: (connectionId: string, ownerId: string, callback: (messages: Message[]) => void) => {
    const q = query(
      messagesRef,
      where('connectionId', '==', connectionId),
      where('ownerId', '==', ownerId)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Message)
        .sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as { toDate: () => Date }).toDate().getTime();
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as { toDate: () => Date }).toDate().getTime();
          return bTime - aTime;
        });
      callback(messages);
    }, (error) => {
      console.error('erro no onSnapshot messages:', error);
    });
  },

  update: async (id: string, content: string, contacts: string[], scheduledAt?: Date) => {
    const messageRef = doc(db, 'messages', id);
    await updateDoc(messageRef, {
      content,
      contacts,
      scheduledAt: scheduledAt ?? null,
      status: scheduledAt ? 'scheduled' : 'sent',
      sentAt: scheduledAt ? null : new Date(),
    });
  },

  delete: async (id: string) => {
    const messageRef = doc(db, 'messages', id);
    await deleteDoc(messageRef);
  },
  markAsSent: async (id: string) => {
  const messageRef = doc(db, "messages", id);
  await updateDoc(messageRef, {
    status: "sent",
    sentAt: new Date(),
  });
},
};
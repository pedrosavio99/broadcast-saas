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
import type { Contact } from '../types';

const contactsRef = collection(db, 'contacts');

export const contactService = {
  create: async (name: string, phone: string, connectionId: string, ownerId: string) => {
    const newContact = {
      name,
      phone,
      connectionId,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(contactsRef, newContact);
    return { id: docRef.id, ...newContact };
  },

  subscribeToContacts: (connectionId: string, ownerId: string, callback: (contacts: Contact[]) => void) => {
    const q = query(
      contactsRef,
      where('connectionId', '==', connectionId),
      where('ownerId', '==', ownerId)
    );

    return onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Contact)
        .sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as { toDate: () => Date }).toDate().getTime();
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as { toDate: () => Date }).toDate().getTime();
          return bTime - aTime;
        });
      callback(contacts);
    }, (error) => {
      console.error('erro no onSnapshot contacts:', error);
    });
  },

  update: async (id: string, name: string, phone: string) => {
    const contactRef = doc(db, 'contacts', id);
    await updateDoc(contactRef, { name, phone, updatedAt: new Date() });
  },

  delete: async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
    await deleteDoc(contactRef);
  },
};
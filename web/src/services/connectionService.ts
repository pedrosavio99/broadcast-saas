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
import type { Connection } from '../types';

const connectionsRef = collection(db, 'connections');

export const connectionService = {
  create: async (name: string, ownerId: string) => {
    const newConnection = {
      name,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(connectionsRef, newConnection);
    console.log('conexão criada com id:', docRef.id);
    return { id: docRef.id, ...newConnection };
  },

  subscribeToUserConnections: (ownerId: string, callback: (connections: Connection[]) => void) => {
    console.log('iniciando subscribe para ownerId:', ownerId);
    const q = query(
      connectionsRef, 
      where('ownerId', '==', ownerId)
    );

    return onSnapshot(q, (snapshot) => {
      console.log('snapshot recebido, docs:', snapshot.docs.length);
      const connections = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Connection)
        .sort((a, b) => {
  const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as { toDate: () => Date }).toDate().getTime();
  const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as { toDate: () => Date }).toDate().getTime();
  return bTime - aTime;
});
      callback(connections);
    }, (error) => {
      console.error('erro no onSnapshot:', error);
    });
  },

  update: async (id: string, name: string) => {
    const connectionRef = doc(db, 'connections', id);
    await updateDoc(connectionRef, { 
      name,
      updatedAt: new Date() 
    });
  },

  delete: async (id: string) => {
    const connectionRef = doc(db, 'connections', id);
    await deleteDoc(connectionRef);
  }
};
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectionService } from '../services/connectionService';
import type { Connection } from '../types';

export function useConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[] | null>(null);

  useEffect(() => {
    if (!user) return;
    console.log('buscando conexões para uid:', user.uid);

    const unsubscribe = connectionService.subscribeToUserConnections(
      user.uid,
      (newConnections) => {
        console.log('conexões recebidas:', newConnections.length);
        setConnections(newConnections);
      }
    );

    return () => {
      unsubscribe();
      setConnections(null);
    };
  }, [user]);

  const loading = user ? connections === null : false;

  return {
    connections: connections ?? [],
    loading,
    createConnection: async (name: string) => {
      if (!user) return;
      await connectionService.create(name, user.uid);
    },
    updateConnection: async (id: string, name: string) => {
      await connectionService.update(id, name);
    },
    deleteConnection: async (id: string) => {
      await connectionService.delete(id);
    },
  };
}
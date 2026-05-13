import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactService } from '../services/contactService';
import type { Contact } from '../types';

export function useContacts(connectionId: string) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[] | null>(null);

  useEffect(() => {
    if (!user || !connectionId) return;

    const unsubscribe = contactService.subscribeToContacts(
      connectionId,
      user.uid,
      (newContacts) => {
        setContacts(newContacts);
      }
    );

    return () => {
      unsubscribe();
      setContacts(null);
    };
  }, [user, connectionId]);

  const loading = user ? contacts === null : false;

  return {
    contacts: contacts ?? [],
    loading,
    createContact: async (name: string, phone: string) => {
      if (!user) return;
      await contactService.create(name, phone, connectionId, user.uid);
    },
    updateContact: async (id: string, name: string, phone: string) => {
      await contactService.update(id, name, phone);
    },
    deleteContact: async (id: string) => {
      await contactService.delete(id);
    },
  };
}
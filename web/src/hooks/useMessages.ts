import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { messageService } from "../services/messageService";
import type { Message } from "../types";

export function useMessages(connectionId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[] | null>(null);

  // Verifica mensagens agendadas e atualiza para enviada
  const processScheduledMessages = async (msgs: Message[]) => {
    const now = new Date();
    const toUpdate = msgs.filter((msg) => {
      if (msg.status !== "scheduled" || !msg.scheduledAt) return false;
      const scheduledDate =
        msg.scheduledAt instanceof Date
          ? msg.scheduledAt
          : (msg.scheduledAt as { toDate: () => Date }).toDate();
      return scheduledDate <= now;
    });

    for (const msg of toUpdate) {
      await messageService.markAsSent(msg.id);
    }
  };

  useEffect(() => {
    if (!user || !connectionId) return;

    const unsubscribe = messageService.subscribeToMessages(
      connectionId,
      user.uid,
      (newMessages) => {
        setMessages(newMessages);
        processScheduledMessages(newMessages);
      }
    );

    return () => {
      unsubscribe();
      setMessages(null);
    };
  }, [user, connectionId]);

  const loading = user ? messages === null : false;

  return {
    messages: messages ?? [],
    loading,
    createMessage: async (
      content: string,
      contacts: string[],
      scheduledAt?: Date
    ) => {
      if (!user) return;
      await messageService.create(
        content,
        contacts,
        connectionId,
        user.uid,
        scheduledAt
      );
    },
    updateMessage: async (
      id: string,
      content: string,
      contacts: string[],
      scheduledAt?: Date
    ) => {
      await messageService.update(id, content, contacts, scheduledAt);
    },
    deleteMessage: async (id: string) => {
      await messageService.delete(id);
    },
  };
}
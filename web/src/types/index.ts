export interface Connection {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  connectionId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  contacts: string[];           // IDs dos contatos
  connectionId: string;
  ownerId: string;
  status: 'scheduled' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
}
export type ElectionStatus = 'upcoming' | 'active' | 'ended';
export type RegistrationStatus = 'pending' | 'verified';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  voterId?: string;
  phone?: string;
  isVerified: boolean;
  registrationStatus: RegistrationStatus;
  votedElections: string[];
  role?: 'voter' | 'candidate' | 'admin';
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: ElectionStatus;
  category: string;
}

export interface Candidate {
  id: string;
  electionId: string;
  name: string;
  party: string;
  bio: string;
  platform: string;
  avatarUrl: string;
  vision?: string;
  stats?: {
    approval: number;
    mentions: number;
  };
}

export interface Vote {
  id: string;
  electionId: string;
  userId: string;
  candidateId: string;
  timestamp: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Election, Candidate, Vote, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';

const MOCK_ELECTIONS: Election[] = [
  {
    id: 'presidential-2026',
    title: 'Global General Election 2026',
    description: 'Vote for the next leadership of the unified planetary council.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    registrationDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'active',
    category: 'Presidential'
  }
];

const MOCK_CANDIDATES: Record<string, Candidate[]> = {
  'presidential-2026': [
    {
      id: 'helena-vance',
      electionId: 'presidential-2026',
      name: 'Dr. Helena Vance',
      party: 'Unity Coalition',
      bio: 'Leading environmental scientist and diplomat. Focused on sustainable infrastructure and AI transparency.',
      platform: 'Harmony Protocol',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      vision: 'A world where technology serves humanity without compromising the ecological balance.',
      stats: { approval: 68, mentions: 12400 }
    },
    {
      id: 'marcus-thorne',
      electionId: 'presidential-2026',
      name: 'Marcus Thorne',
      party: 'Forward Tech Party',
      bio: 'Former CEO of NeuralLink Systems. Proponent of rapid space colonization and universal digital basic income.',
      platform: 'Acceleration Manifesto',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
      vision: 'Unlocking human potential through radical innovation and off-world expansion.',
      stats: { approval: 54, mentions: 28900 }
    }
  ]
};

export async function getElections(): Promise<Election[]> {
  const path = 'elections';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) return MOCK_ELECTIONS;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Election));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return MOCK_ELECTIONS;
  }
}

export async function getCandidates(electionId: string): Promise<Candidate[]> {
  const path = `elections/${electionId}/candidates`;
  try {
    const snapshot = await getDocs(collection(db, 'elections', electionId, 'candidates'));
    if (snapshot.empty) return MOCK_CANDIDATES[electionId] || [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return MOCK_CANDIDATES[electionId] || [];
  }
}

export async function submitVote(electionId: string, userId: string, candidateId: string) {
  const voteId = `${electionId}_${userId}`;
  const path = `votes/${voteId}`;
  
  try {
    const voteRef = doc(db, 'votes', voteId);
    await setDoc(voteRef, {
      electionId,
      userId,
      candidateId,
      timestamp: serverTimestamp()
    });
    
    // In a real app, updating the user's votedElections would be atomic
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const votedElections = userDoc.data().votedElections || [];
      if (!votedElections.includes(electionId)) {
        await setDoc(userRef, { 
          votedElections: [...votedElections, electionId] 
        }, { merge: true });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateCandidateProfile(electionId: string, candidateId: string, data: Partial<Candidate>) {
  const path = `elections/${electionId}/candidates/${candidateId}`;
  try {
    const candidateRef = doc(db, 'elections', electionId, 'candidates', candidateId);
    await setDoc(candidateRef, { ...data }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Seed function for demo
export async function seedDemoData() {
  const electionsRef = collection(db, 'elections');
  try {
    const snapshot = await getDocs(electionsRef);
    
    if (snapshot.empty) {
      const batch = writeBatch(db);
      
      // Election
      const e1Id = 'presidential-2026';
      const e1Ref = doc(db, 'elections', e1Id);
      batch.set(e1Ref, {
        title: 'Global General Election 2026',
        description: 'Vote for the next leadership of the unified planetary council.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        registrationDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: 'active',
        category: 'Presidential'
      });
      
      // Candidates
      const c1Id = 'helena-vance';
      const c1Ref = doc(db, 'elections', e1Id, 'candidates', c1Id);
      batch.set(c1Ref, {
        name: 'Dr. Helena Vance',
        party: 'Unity Coalition',
        bio: 'Leading environmental scientist and diplomat. Focused on sustainable infrastructure and AI transparency.',
        platform: 'Harmony Protocol',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        vision: 'A world where technology serves humanity without compromising the ecological balance.',
        stats: { approval: 68, mentions: 12400 }
      });
      
      const c2Id = 'marcus-thorne';
      const c2Ref = doc(db, 'elections', e1Id, 'candidates', c2Id);
      batch.set(c2Ref, {
        name: 'Marcus Thorne',
        party: 'Forward Tech Party',
        bio: 'Former CEO of NeuralLink Systems. Proponent of rapid space colonization and universal digital basic income.',
        platform: 'Acceleration Manifesto',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
        vision: 'Unlocking human potential through radical innovation and off-world expansion.',
        stats: { approval: 54, mentions: 28900 }
      });
      
      await batch.commit();
      console.log('Demo data seeded successfully');
    }
  } catch (e) {
    console.warn("Seeding skipped due to permissions", e);
  }
}

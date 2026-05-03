import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection,
  query,
  where,
  getDocs,
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';

const googleProvider = new GoogleAuthProvider();

/**
 * Handle user profile creation or retrieval after any sign-in method
 */
async function syncUserProfile(user: FirebaseUser | { uid: string, displayName?: string | null, email?: string | null }, displayName?: string | null, extraData: Partial<UserProfile> = {}): Promise<UserProfile | null> {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userDocRef);
    
    // Security: If voterId is provided, check if it's already claimed by another identity
    // Bypass for demo IDs to allow shared testing
    const isDemoId = extraData.voterId === 'DEMO-VOTER' || extraData.voterId === 'DEMO-CANDIDATE';
    if (extraData.voterId && !user.uid.startsWith('mock-') && !isDemoId) {
      const q = query(collection(db, 'users'), where('voterId', '==', extraData.voterId));
      const snap = await getDocs(q);
      if (!snap.empty && snap.docs[0].id !== user.uid) {
        throw new Error('This Voter ID is already registered to a different digital signature.');
      }
    }

    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        uid: user.uid,
        displayName: displayName || ('displayName' in user ? user.displayName : null) || 'Voter',
        email: user.email || `${user.uid}@clearvote.local`,
        isVerified: false,
        registrationStatus: 'pending',
        votedElections: [],
        createdAt: new Date().toISOString(),
        role: 'voter',
        ...extraData
      };
      
      await setDoc(userDocRef, {
        ...newUser,
        createdAt: serverTimestamp()
      });
      return newUser;
    }
    
    const existing = userDoc.data() as UserProfile;
    // If extraData provided (like a voterId), update it if missing
    if (Object.keys(extraData).length > 0) {
      await setDoc(userDocRef, { ...extraData }, { merge: true });
      return { ...existing, ...extraData };
    }

    return existing;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'users');
    return null;
  }
}

async function safeSignInAnonymously() {
  try {
    return await signInAnonymously(auth);
  } catch (error: any) {
    if (error.code === 'auth/admin-restricted-operation') {
      const msg = "Anonymous Authentication is disabled in your Firebase Console. Please go to Authentication > Sign-in method and enable 'Anonymous' to use this feature.";
      console.error(msg);
      throw new Error(msg);
    }
    throw error;
  }
}

export async function loginWithVoterId(voterId: string): Promise<UserProfile | null> {
  const cleanId = voterId.trim().toUpperCase();
  
  // Normal Voter ID logic
  try {
    const result = await safeSignInAnonymously();
    return await syncUserProfile(result.user, `Voter ${voterId.slice(-4)}`, { voterId: cleanId });
  } catch (error: any) {
    // If it's a demo flow or specifically the restricted error, we can offer a more graceful path
    if (error.message && error.message.includes('Anonymous Authentication is disabled')) {
       // Only allow mock for specific demo IDs to prevent security bypasses on real data
       if (cleanId.startsWith('DEMO-')) {
          return {
            uid: `mock-${cleanId}`,
            displayName: cleanId === 'DEMO-CANDIDATE' ? 'Marcus Thorne' : 'Demo Voter',
            email: `${cleanId.toLowerCase()}@demo.local`,
            isVerified: true,
            registrationStatus: 'verified',
            votedElections: [],
            createdAt: new Date().toISOString(),
            role: cleanId === 'DEMO-CANDIDATE' ? 'candidate' : 'voter',
            voterId: cleanId
          };
       }
       throw error;
    }
    if (error.message && error.message.includes('operationType')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'auth');
    return null;
  }
}

export async function loginWithPhone(phone: string): Promise<UserProfile | null> {
  try {
    const result = await safeSignInAnonymously();
    return await syncUserProfile(result.user, `User ${phone.slice(-4)}`, { phone });
  } catch (error: any) {
    if (error.message && error.message.includes('Anonymous Authentication is disabled')) {
        throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'auth');
    return null;
  }
}

export async function loginWithEmail(email: string): Promise<UserProfile | null> {
  try {
    const result = await safeSignInAnonymously();
    return await syncUserProfile(result.user, email.split('@')[0], { email });
  } catch (error: any) {
    if (error.message && error.message.includes('Anonymous Authentication is disabled')) {
        throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'auth');
    return null;
  }
}

export async function loginWithCandidateId(candidateId: string): Promise<UserProfile | null> {
  try {
    const result = await safeSignInAnonymously();
    const profile = await syncUserProfile(result.user, `Candidate ${candidateId.slice(-4)}`);
    if (profile) {
      const updatedProfile = { ...profile, role: 'candidate' as const };
      await updateUserProfile(profile.uid, { role: 'candidate' });
      return updatedProfile;
    }
    return null;
  } catch (error: any) {
    if (error.message && error.message.includes('Anonymous Authentication is disabled')) {
        throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'auth');
    return null;
  }
}

export async function signUpWithEmailPassword(email: string, pass: string, name: string, voterId: string): Promise<UserProfile | null> {
  try {
    // 1. Create Auth User
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    
    // 2. Sync Profile (which performs uniqueness check on voterId)
    return await syncUserProfile(result.user, name, { voterId, role: 'voter' });
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already in use. Please log in instead.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 6 characters.');
    }
    // If it's already a handled firestore error, don't wrap it again
    if (error.message && error.message.includes('operationType')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'auth');
    return null;
  }
}

export async function loginWithEmailPassword(email: string, pass: string): Promise<UserProfile | null> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return await getUserProfile(result.user.uid);
  } catch (error: any) {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password.');
    }
    if (error.message && error.message.includes('operationType')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.GET, 'auth');
    return null;
  }
}

export async function loginWithGoogle(): Promise<UserProfile | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await syncUserProfile(result.user);
  } catch (error: any) {
    if (error.message && error.message.includes('operationType')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'users');
    return null;
  }
}

export async function logout() {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  try {
    await setDoc(userDocRef, { ...data }, { merge: true });
  } catch (error: any) {
    if (error.message && error.message.includes('operationType')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'users');
  }
}

export async function deleteUserProfile(uid: string): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  try {
    // Completely remove the document from the collection
    if (!uid.startsWith('mock-')) {
      await deleteDoc(userDocRef);
    }
  } catch (error) {
    console.error("Failed to delete user document:", error);
    // Continue with sign out even if delete fails
  } finally {
    await signOut(auth);
  }
}

// Test connection strictly as required
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

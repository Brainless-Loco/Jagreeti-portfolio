import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  writeBatch,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

const viteEnv = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const firebaseConfig = {
  apiKey: viteEnv.VITE_FIREBASE_API_KEY,
  authDomain: viteEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: viteEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: viteEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: viteEnv.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const app = firebaseConfigured ? initializeApp(firebaseConfig) : null;
export const firestore = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const auth = app ? getAuth(app) : null;

export async function signInAdmin(email: string, password: string): Promise<void> {
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  await signInWithEmailAndPassword(auth, email, password);
}

export function subscribeToCollection<T extends DocumentData>(
  collectionName: string,
  onChange: (items: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!firestore) return () => undefined;
  return onSnapshot(
    collection(firestore, collectionName),
    (snapshot) =>
      onChange(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as unknown as T)),
    (error) => onError?.(error)
  );
}

export async function replaceCollection<T extends { id: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  if (!firestore) return;
  const existing = await getDocs(collection(firestore, collectionName));
  const nextIds = new Set(items.map((item) => item.id));
  const batch = writeBatch(firestore);

  existing.docs.forEach((item) => {
    if (!nextIds.has(item.id)) batch.delete(item.ref);
  });
  items.forEach((item) => {
    const { id, ...data } = item;
    batch.set(doc(firestore!, collectionName, id), data);
  });
  await batch.commit();
}

export async function replaceSingleton<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  value: T
): Promise<void> {
  if (!firestore) return;
  await setDoc(doc(firestore, collectionName, documentId), value);
}

export async function removeDocument(collectionName: string, id: string): Promise<void> {
  if (!firestore) return;
  await deleteDoc(doc(firestore, collectionName, id));
}

export async function uploadFileToStorage(file: File, storagePath: string) {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  const uploaded = await uploadBytes(ref(storage, storagePath), file, { contentType: file.type });
  return { url: await getDownloadURL(uploaded.ref), storagePath };
}

export async function removeStorageFile(storagePath?: string): Promise<void> {
  if (!storagePath || !storage) return;
  try {
    await deleteObject(ref(storage, storagePath.replace(/^gs:\/\/[^/]+\//, '')));
  } catch (error: any) {
    if (error?.code !== 'storage/object-not-found') throw error;
  }
}

export { onAuthStateChanged, signOut };
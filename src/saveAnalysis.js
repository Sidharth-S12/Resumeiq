import { db } from './firebase'
import {
  collection, addDoc, query,
  where, getDocs, serverTimestamp
} from 'firebase/firestore'

// Save analysis result to Firestore
export async function saveAnalysis(userId, jobRole, fileName, results) {
  const docRef = await addDoc(collection(db, 'analyses'), {
    userId,
    jobRole,
    fileName,
    results,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// Get all analyses for a user
// Note: sorted client-side to avoid needing a Firestore composite index
export async function getUserAnalyses(userId) {
  try {
    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Sort by createdAt descending on the client side
    docs.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return bTime - aTime
    })

    return docs
  } catch (e) {
    console.error('Error fetching analyses:', e)
    return []
  }
}
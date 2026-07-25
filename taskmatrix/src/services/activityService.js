import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const activityRef = collection(db, "activity");

/**
 * Logs an activity to Firestore.
 * @param {string} action - "created", "edited", "deleted", "moved"
 * @param {string} taskTitle - Title of the task
 * @param {string} statusFrom - Previous status (optional)
 * @param {string} statusTo - New status (optional)
 * @param {object} user - User object { uid, name }
 */
export async function logActivity(action, taskTitle, statusFrom, statusTo, user) {
  if (!user || !user.uid) {
    console.warn("logActivity: Missing user context");
    return;
  }

  const payload = {
    userId: user.uid,
    userName: user.name || "Unknown User",
    action,
    taskTitle,
    statusFrom: statusFrom || null,
    statusTo: statusTo || null,
    timestamp: serverTimestamp(),
  };

  try {
    await addDoc(activityRef, payload);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

/**
 * Subscribes to the activity feed for the last 24 hours.
 * @param {function} callback - Callback function receives array of activities
 * @returns {function} - Unsubscribe function
 */
export function subscribeToActivityFeed(callback) {
  // 24 hours ago
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const q = query(
    activityRef,
    where("timestamp", ">=", yesterday),
    orderBy("timestamp", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert server timestamp to serialized ISO string or fallback
      timestamp: doc.data().timestamp?.toDate?.().toISOString() || new Date().toISOString(),
    }));
    callback(activities);
  });

  return unsubscribe;
}

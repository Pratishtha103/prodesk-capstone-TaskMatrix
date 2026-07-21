import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const tasksRef = collection(db, "tasks");

function formatTask(docSnap) {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    ...data,
    subtasks: data.subtasks || [],
    createdAt: data.createdAt?.toDate?.().toISOString() || null,
  };
}

export async function getTasksByUser(uid, role) {
  let q;
  if (role === "Admin") {
    q = query(
      tasksRef,
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(
      tasksRef,
      where("assigneeId", "==", uid),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(formatTask);
}

export async function createTask(taskData, user) {
  const payload = {
    title: taskData.title,
    description: taskData.description || "",
    priority: taskData.priority || "Medium",
    status: taskData.status || "todo",
    dueDate: taskData.dueDate,
    createdBy: user.uid,
    assigneeId: taskData.assigneeId,
    assigneeName: taskData.assigneeName,
    subtasks: taskData.subtasks || [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(tasksRef, payload);
  const savedDoc = await getDoc(doc(db, "tasks", docRef.id));

  return formatTask(savedDoc);
}

export async function updateTask(taskId, updatedData) {
  const taskDocRef = doc(db, "tasks", taskId);
  const payload = {
    title: updatedData.title,
    description: updatedData.description || "",
    priority: updatedData.priority,
    status: updatedData.status,
    dueDate: updatedData.dueDate,
    assigneeId: updatedData.assigneeId,
    assigneeName: updatedData.assigneeName,
    subtasks: updatedData.subtasks || [],
  };

  await updateDoc(taskDocRef, payload);

  return {
    id: taskId,
    ...payload,
    createdAt: updatedData.createdAt || null,
    createdBy: updatedData.createdBy || null,
  };
}

export async function deleteTask(taskId) {
  const taskDocRef = doc(db, "tasks", taskId);
  await deleteDoc(taskDocRef);
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    name: docSnap.data().username || docSnap.data().email || "User",
    email: docSnap.data().email,
  }));
}
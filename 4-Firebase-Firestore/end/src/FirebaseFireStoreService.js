import firebase from "./FirebaseConfig";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";

const db = getFirestore(firebase);

const createDocument = async (collectionName, document) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), document);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const readDocument = async (collectionName, id) => {
  const startAfterDocumentRef = doc(db, collectionName, id);

  const docSnap = await getDoc(startAfterDocumentRef);
  return docSnap;
};
const readDocuments = async ({
  collection: collectionName,
  queries,
  orderByField,
  orderByDirection,
  perPage,
  cursorId,
}) => {
  let collectionRef = collection(db, collectionName);

  if (queries && queries.length > 0) {
    queries.forEach(({ field, condition, value }) => {
      collectionRef = query(collectionRef, where(field, condition, value));
    });
  }
  if (orderByField && orderByDirection) {
    collectionRef = query(
      collectionRef,
      orderBy(orderByField, orderByDirection)
    );
  }
  const recipeCount = await getDocs(collectionRef);

  if (perPage) {
    collectionRef = query(collectionRef, limit(perPage));
  }
  if (cursorId) {
    const startAfterDocumentSnapshot = await readDocument(
      collectionName,
      cursorId
    );

    collectionRef = query(
      collectionRef,
      startAfter(startAfterDocumentSnapshot)
    );
  }

  const querySnapshot = await getDocs(collectionRef);
  let docObject = {
    results: querySnapshot,
    recipeSize: recipeCount.size,
  };

  return docObject;
};

const updateDocument = async (collectionName, id, document) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, document);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const deleteDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  return deleteDoc(docRef);
};

const FirebaseFirestoreService = {
  createDocument,
  readDocuments,
  updateDocument,
  deleteDocument,
};

export default FirebaseFirestoreService;

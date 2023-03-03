import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { uuidv4 } from "@firebase/util";
import { FormatDate } from "../../helpers/moment";

async function searshEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  } else {
    let userData;
    querySnapshot.forEach((doc) => {
      userData = {
        uid: doc.id,
        ...doc.data(),
      };
    });
    return userData;
  }
}

//save database
export async function saveDataConceptService(data) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "concepts", uid), data);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function saveDataTypeConceptService(data) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "type_concepts", uid), data);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function saveDataGroupService(data) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "groups", uid), data);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function saveDataMonthService(data) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "months", uid), data);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function saveDataSeriesService(data) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "series", uid), data);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function saveDataGeadquarterService(data) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "geadquarters", uid), data);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//update data
export async function updateDataConceptService(document, uid) {
  const userRef = doc(db, "concepts", uid);
  try {
    await updateDoc(userRef, {
      ...document,
      update_at: FormatDate(),
    });
    return true;
  } catch (error) {
    return error;
  }
}
export async function updateDataTypeConceptService(document, uid) {
  const userRef = doc(db, "type_concepts", uid);
  try {
    await updateDoc(userRef, {
      ...document,
      update_at: FormatDate(),
    });
    return true;
  } catch (error) {
    return error;
  }
}
export async function updateDataGroupService(document, uid) {
  const userRef = doc(db, "groups", uid);
  try {
    await updateDoc(userRef, {
      ...document,
      update_at: FormatDate(),
    });
    return true;
  } catch (error) {
    return error;
  }
}
export async function updateDataMonthService(document, uid) {
  const userRef = doc(db, "months", uid);
  try {
    await updateDoc(userRef, {
      ...document,
      update_at: FormatDate(),
    });
    return true;
  } catch (error) {
    return error;
  }
}
export async function updateDataSeriesService(document, uid) {
  const userRef = doc(db, "series", uid);
  try {
    await updateDoc(userRef, {
      ...document,
      update_at: FormatDate(),
    });
    return true;
  } catch (error) {
    return error;
  }
}
export async function updateDataGeadquarterService(document, uid) {
  const userRef = doc(db, "geadquarters", uid);
  try {
    await updateDoc(userRef, {
      ...document,
      update_at: FormatDate(),
    });
    return true;
  } catch (error) {
    return error;
  }
}

//delete data
export async function deleteDataConceptService(uid) {
  try {
    await deleteDoc(doc(db, "concepts", uid));
    return true;
  } catch (error) {
    return error;
  }
}
export async function deleteDataTypeConceptService(uid) {
  try {
    await deleteDoc(doc(db, "type_concepts", uid));
    return true;
  } catch (error) {
    return error;
  }
}
export async function deleteDataGroupService(uid) {
  try {
    await deleteDoc(doc(db, "groups", uid));
    return true;
  } catch (error) {
    return error;
  }
}
export async function deleteDataMonthService(uid) {
  try {
    await deleteDoc(doc(db, "months", uid));
    return true;
  } catch (error) {
    return error;
  }
}
export async function deleteDataSeriesService(uid) {
  try {
    await deleteDoc(doc(db, "series", uid));
    return true;
  } catch (error) {
    return error;
  }
}
export async function deleteDataGeadquarterService(uid) {
  try {
    await deleteDoc(doc(db, "geadquarters", uid));
    return true;
  } catch (error) {
    return error;
  }
}

//getting data
export function getDataConcepetsService(setData) {
  const q = query(collection(db, "concepts"), orderBy("created_at", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(users);
  });

  return () => unsubscribe();
}
export function getDataTypeConcepetsService(setData) {
  const q = query(
    collection(db, "type_concepts"),
    orderBy("created_at", "desc")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(users);
  });

  return () => unsubscribe();
}
export function getDataGroupsService(setData) {
  const q = query(collection(db, "groups"), orderBy("name", "asc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(users);
  });

  return () => unsubscribe();
}
export function getDataMonthsService(setData) {
  const q = query(collection(db, "months"), orderBy("created_at", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(users);
  });

  return () => unsubscribe();
}
export function getDataSeriesService(setData) {
  const q = query(collection(db, "series"), orderBy("created_at", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(users);
  });

  return () => unsubscribe();
}
export function getDataGeadquartersService(setData) {
  const q = query(collection(db, "geadquarters"), orderBy("created_at", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(users);
  });

  return () => unsubscribe();
}


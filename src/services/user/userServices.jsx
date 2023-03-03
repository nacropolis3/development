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
} from "firebase/firestore";
import { db } from "../../firebase/config";

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

async function saveUser(user, uid) {
  try {
    await setDoc(doc(db, "users", uid), user);
  } catch (error) {
    console.log(error);
    return error;
  }
}

function getUsersService(setData) {
  const q = query(collection(db, "users"), orderBy("created_at", "desc"));
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

function getUserService(setData, uid) {
  const unsubscribe = onSnapshot(doc(db, "users", uid), (doc) => {
    setData({
      ...doc.data(),
      uid,
    });
  });

  return () => unsubscribe();
}

async function updateUserService(document, uid) {
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, document);
    return true;
  } catch (error) {
    return error;
  }
}

export {
  searshEmail,
  saveUser,
  getUserService,
  getUsersService,
  updateUserService,
};

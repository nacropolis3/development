import {
  collection,
  query,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { uuidv4 } from "@firebase/util";
import { FormatDate } from "../../helpers/moment";

export async function saveActivitieService(activity) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "activities", uid), {
      ...activity,
      created_at: FormatDate(),
    });
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export function getActivitiesService(setData, data, conditions, setLast) {
  const q = query(
    collection(db, "activities"),
    orderBy("created_at", "desc"),
    limit(20),
    ...conditions
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(data ? data.concat(activities) : activities);
    setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
  });

  return () => unsubscribe();
}

export function getActivitieService(setData, uid) {
  const unsubscribe = onSnapshot(doc(db, "activities", uid), (doc) => {
    setData({
      ...doc.data(),
      uid,
    });
  });

  return () => unsubscribe();
}

export function getActivitieServiceSearsh(setData, conditions) {
  const q = query(collection(db, "members"), ...conditions);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(members);
  });

  return () => unsubscribe();
}

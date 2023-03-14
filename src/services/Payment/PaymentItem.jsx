import {
  collection,
  query,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { uuidv4 } from "@firebase/util";

export async function savePaymentsItemService(payment) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "paymentsItem", uid), payment);
    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export function getPaymentItemsService(setData, conditions) {
  const q = query(
    collection(db, "paymentsItem"),
    ...conditions,
    orderBy("date", "desc")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(payments);
  });

  return () => unsubscribe();
}

export function getPaymentItemService(setData, uid) {
  const unsubscribe = onSnapshot(doc(db, "paymentsItem", uid), (doc) => {
    setData({
      ...doc.data(),
      uid,
    });
  });

  return () => unsubscribe();
}

export async function updatePaymentsItemService(document, uid) {
  const paymentRef = doc(db, "paymentsItem", uid);
  try {
    await updateDoc(paymentRef, { ...document });
    return true;
  } catch (error) {
    return error;
  }
}

export async function deletePaymentsItemService(uid) {
  await deleteDoc(doc(db, "paymentsItem", uid));
}

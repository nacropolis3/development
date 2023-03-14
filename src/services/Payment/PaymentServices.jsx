import {
  collection,
  query,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { saveActivitieService } from "../Activities/ActivitiesServices";
import { deletePaymentsItemService } from "./PaymentItem";

export async function savePaymentService(payment, uid, user) {
  try {
    await setDoc(doc(db, "payments", uid), payment);

    await saveActivitieService({
      module: "Pago",
      action: {
        name: "Registro de pago",
        uid: uid,
      },
      description: "Registro un pago - Boleta: " + payment.billHeader,
      user: {
        names: user?.name,
        uid: user?.uid,
        photo: user?.photoUrl,
      },
    });

    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export function getPaymentsService(setData, data, conditions, setLast) {
  const q = query(collection(db, "payments"), ...conditions);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(data ? data.concat(payments) : payments);
    setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
  });

  return () => unsubscribe();
}

export function getPaymentsServiceSearsh(setData, conditions) {
  const q = query(collection(db, "payments"), ...conditions);
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

export function getPaymentService(setData, uid) {
  const unsubscribe = onSnapshot(doc(db, "payments", uid), (doc) => {
    setData({
      ...doc.data(),
      uid,
    });
  });

  return () => unsubscribe();
}

export async function updatePaymentService(document, uid, user) {
  const memberRef = doc(db, "payments", uid);
  try {
    await updateDoc(memberRef, document);
    await saveActivitieService({
      module: "TIcket",
      action: {
        name: "Anulación",
        uid: uid,
      },
      description: `Ticket Anulado ${document.billHeader}`,
      user: {
        names: user?.name,
        uid: user?.uid,
        photo: user?.photoUrl,
      },
    });

    await Promise.all(
      document.paymountList.forEach(async (item) => {
        await deletePaymentsItemService(item.uid);
      })
    );

    return true;
  } catch (error) {
    return error;
  }
}

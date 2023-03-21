import { uuidv4 } from "@firebase/util";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export async function uploadImage(file, alt, path) {
  if (!file) {
    return {
      public_id: "univercel/ks6hjfzn4ufilxsqgij3",
      uid: null,
    };
  }
  const url = import.meta.env.VITE_URL_CLOUDINARY;
  const uid = uuidv4();

  var formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  formData.append("api_key", import.meta.env.VITE_API_KEY);
  formData.append("created_at", Date.now());
  const config = {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  };

  try {
    const res = await axios.post(url, formData, config);
    const data = res.data;
    const cloudinarydata = {
      url: data.secure_url,
      format: data.format,
      public_id: data.public_id,
      resource_type: data.resource_type,
      size: {
        width: data.width,
        height: data.height,
      },
      path: path,
    };
    await setDoc(doc(db, "photos", uid), {
      ...cloudinarydata,
      altName: alt,
    });
    return {
      uid: uid,
      public_id: data.public_id,
      resource_type: data.resource_type,
    };
  } catch (error) {
    return error;
  }
}

export async function uploadImages(files, alt, path) {
  if (!files) {
    return [
      {
        public_id: "metagoo/38598874290528402_axriem",
        uid: null,
      },
    ];
  }
  let dataFiles = [];
  const uploads = files.map(async (file) => {
    const uid = uuidv4();
    const url = import.meta.env.VITE_URL_CLOUDINARY;

    var formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("api_key", import.meta.env.VITE_API_KEY);
    formData.append("created_at", Date.now());
    const config = {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    };

    try {
      const res = await axios.post(url, formData, config);
      const data = res.data;
      const cloudinarydata = {
        url: data.secure_url,
        format: data.format,
        public_id: data.public_id,
        size: {
          width: data.width,
          height: data.height,
        },
        path: "/products/" + data.uid,
        path: path,
        resource_type: data.resource_type,
      };
      await setDoc(doc(db, "photos", uid), {
        ...cloudinarydata,
        altName: alt,
      });
      dataFiles.push({
        uid: uid,
        public_id: data.public_id,
        resource_type: data.resource_type,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  });

  await axios.all(uploads);
  return dataFiles;
}

export async function getImageService(uid) {
  const docRef = doc(db, "photos", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

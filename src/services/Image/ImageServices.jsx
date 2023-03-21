import axios from "axios";

export async function uploadImage(file) {
  if (!file) return;
  const url = import.meta.env.VITE_URL_CLOUDINARY;
  var formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  formData.append("api_key", import.meta.env.VITE_API_KEY_CLOUDINARY);
  formData.append("timestamp", (Date.now() / 1000) | 0);

  const config = {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  };

  try {
    const res = await axios.post(url, formData, config);
    const data = res.data;
    return {
      public_id: data.public_id,
      resource_type: data.resource_type,
    };
  } catch (error) {
    return error;
  }
}

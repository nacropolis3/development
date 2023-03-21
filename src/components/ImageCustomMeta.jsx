import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import React from "react";

export default function ImageCustomMeta(props) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_UPLOAD_PRESET,
    },
  });
  const Image = cld.image(props.public_id);

  if (props.custom) {
    Image.resize(fill().width(props.width ? props.width : 100));
  }
  return (
    <AdvancedImage
      draggable="false"
      cldImg={Image}
      className={props.className}
      style={{
        filter: props.brightness ? "brightness(1.1)" : null,
      }}
      alt={props.altName}
      title={props.altName}
    />
  );
}

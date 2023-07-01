import React, { useState } from "react";
import { Image } from "cloudinary-react";

const UploadImage = () => {
  const [imageURL, setImageURL] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dzg6u1lo"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlojlo14f/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImageURL(data.secure_url);
      console.log(imageURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const cloudName = "dlojlo14f";
  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {imageURL && <Image cloudName={cloudName} publicId={imageURL} />}
    </div>
  );
};

export default UploadImage;

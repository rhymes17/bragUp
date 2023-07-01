import React, { useEffect, useRef } from "react";

function AmbientImage({ src }) {
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      const image = imageRef.current;
      const container = image.parentNode;

      image.addEventListener("load", () => {
        const imageColor = getAverageImageColor(image);
        container.style.setProperty("--box-shadow-color", imageColor);
      });
    }
  }, []);

  function getAverageImageColor(image) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;

      for (let i = 0; i < data.length; i += 4) {
        redSum += data[i];
        greenSum += data[i + 1];
        blueSum += data[i + 2];
      }

      const pixelCount = data.length / 4;
      const averageRed = Math.floor(redSum / pixelCount);
      const averageGreen = Math.floor(greenSum / pixelCount);
      const averageBlue = Math.floor(blueSum / pixelCount);

      return `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;
    } catch (error) {
      console.error("Error getting image data:", error);
      // Return a fallback color in case of any error
      return "#000000";
    }
  }

  return (
    <div className="image-container">
      <div className="box-shadow-container rounded-2xl aspect-w-1 aspect-h-1 max-h-[350px] md:max-h-[450px] overflow-hidden">
        <img
          className="rounded-2xl"
          ref={imageRef}
          src={src}
          alt="Your Image"
        />
      </div>
    </div>
  );
}

export default AmbientImage;

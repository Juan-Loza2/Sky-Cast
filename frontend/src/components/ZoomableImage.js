"use client"

import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ZoomableImage = ({ src, alt, className = "" }) => {
  return (
    <div className={className}>
      <Zoom>
        <img
          src={src || "/placeholder.svg?height=400&width=600"}
          alt={alt}
          className="w-full h-auto rounded-lg cursor-pointer"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      </Zoom>
    </div>
  );
};

export default ZoomableImage;

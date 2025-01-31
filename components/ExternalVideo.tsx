import React from "react";

const ExternalVideo = ({ src, width = "100%", height = "500px", className, style }) => {
  return (
    <div style={{
      marginTop: "20px",
      border: "1px solid #eee",
      borderRadius: "8px",
      margin: "2rem 0",
      padding: "8px",
      ...style 
      }} className={className}>
      <iframe
        src={src}
        frameBorder="0"
        sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin allow-storage-access-by-user-activation allow-popups-to-escape-sandbox"
        allowFullScreen
        style={{
          width: width,
          height: height,
          borderRadius: "1px",
          pointerEvents: "auto",
          backgroundColor: "white",
        }}
      ></iframe>
    </div>
  );
};

export default ExternalVideo;

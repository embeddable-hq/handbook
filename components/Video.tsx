import React from "react";

const VideoComponent = ({ src, width = 16, height = 9, className }) => {
  // Calculate aspect ratio for padding-top
  const aspectRatio = (height / width) * 100;

  return (
    <div style={{
        border: "1px solid #eee",
        borderRadius: "8px",
        margin: "2rem 0",
        padding: "8px"
    }}
    >
        <div
        className={className}
        style={{
            position: "relative",
            width: "100%",
            paddingTop: `${aspectRatio}%`,
            overflow: "hidden",
        }}
        >
        <video
            src={src}
            autoPlay
            playsInline
            muted
            loop
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
        />
        </div>
    </div>
  );
};

export default VideoComponent;

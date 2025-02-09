import React, { useState } from "react";

const ImageGrid = ({ images, className, width }) => {
  const [openImg, setOpenImg] = useState(null);
  const handleClick = (src) => setOpenImg(src);
  const handleClose = () => setOpenImg(null);

  // If there's only one image, use one column; otherwise use up to two columns
  const columns = images.length === 1 ? "1fr" : "repeat(2, 1fr)";

  return (
    <>
      <div className={className ? className : "image-grid"}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index}`}
            style={{
              width: width || "100%",
              height: "auto",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "8px",
              margin: "2rem 0",
              cursor: "pointer",
            }}
            onClick={() => handleClick(src)}
          />
        ))}
      </div>

      {/* Lightbox Overlay */}
      {openImg && (
        <div
          className="lightbox-overlay"
          onClick={handleClose}
        >
          <img src={openImg} alt="Enlarged" className="lightbox-image" />
        </div>
      )}

      {/* Styling */}
      <style jsx>{`
        .image-grid {
          display: grid;
          grid-template-columns: ${columns};
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .image-grid {
            grid-template-columns: 1fr;
          }
        }

        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .lightbox-image {
          max-width: 90%;
          max-height: 90%;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default ImageGrid;
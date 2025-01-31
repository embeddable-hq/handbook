import React from "react";

const CardGrid = ({ children, className }) => {
  return (
    <>
      <div className={className ? className : "card-grid"}>
        {children}
      </div>

      <style jsx>{`
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        @media (max-width: 600px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CardGrid;
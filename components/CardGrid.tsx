import React, { Children } from "react";

const CardGrid = ({ children, className }) => {

  const childrenLength = Children.toArray(children).length;
  const columns = childrenLength === 1 ? "1fr" : "repeat(2, 1fr)";

  return (
    <>
      <div className={className ? className : "card-grid"}>
        {children}
      </div>

      <style jsx>{`
        .card-grid {
          display: grid;
          grid-template-columns: ${columns};
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
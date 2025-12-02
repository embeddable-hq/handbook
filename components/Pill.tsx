import React, { Children } from "react";

const Pill = ({ children, className }: { children: React.ReactNode, className: string }) => {

  return (
    <>
      <div className={className ? className : "pill"}>
        {children}
      </div>

      <style jsx>{`
        .pill {
        display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          background-color: rgba(243, 244, 246, 1);
          font-size: 0.85rem;
          font-weight: 400;
          margin: 1rem 0 0 0;
        }
      `}</style>
    </>
  );
};

export default Pill;
import React, { useState } from "react";

const CodeContainer = ({ children, language }) => {
  const [isExtended, setIsExtended] = useState(false);


  return (
    <>
      <div className={"code-container"}>
        <div
            style={{ maxHeight: isExtended ? "none" : "300px", overflow: "scroll" }}
        >
            {children}
        </div>
        <div className="code-container-toggle">
            <button onClick={()=> setIsExtended(!isExtended)}>{isExtended ? "Collapse" : "Expand"}</button>
        </div>   
           
      </div>
      {/* Styling */}
      <style jsx>{`
        .code-container {
            padding: 8px;
            border: 1px solid #eee;
            border-radius: 8px;
        }

        .code-container-toggle {
            display: flex;
            justify-content: flex-end;
            margin-top: 8px;
        }

      `}</style>
    </>
  );
};

export default CodeContainer;
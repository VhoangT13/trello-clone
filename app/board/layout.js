import Sidebar from "@/components/Sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex h-[calc(100vh-72px)]">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;

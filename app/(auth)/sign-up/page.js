import React from "react";
import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <SignUp afterSignUpUrl="/board" />
    </div>
  );
};

export default page;

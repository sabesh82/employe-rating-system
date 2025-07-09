import React from "react";
import LoginForm from "./LoginForm";

const page = () => {
  return (
    <section className="flex h-dvh w-full flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xs">
        <LoginForm />
      </div>
    </section>
  );
};

export default page;

"use client";

import CreateOrganizationForm from "./NewOrganizationForm";

const CreateOrganizationPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Create Organization
        </h1>
        <CreateOrganizationForm />
      </div>
    </main>
  );
};

export default CreateOrganizationPage;

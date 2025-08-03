"use client";

export default function HelpPage() {
  return (
    <section className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Help & Support
        </h1>

        <div className="scrollbar-thin max-h-[81vh] overflow-y-auto rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <div className="space-y-10 pr-4">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                What is this application?
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                This application helps organizations evaluate employee
                performance through a structured rating system. Depending on
                your role — Owner, Supervisor, or Employee — you will have
                different access and capabilities.
              </p>
            </div>

            {/* Getting Started */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Getting Started
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-300">
                <li>
                  Owners can create organizations from the "New Organization"
                  page.
                </li>
                <li>
                  Members can be invited or added by the organization owner.
                </li>
                <li>Supervisors can rate employees under their supervision.</li>
              </ul>
            </div>

            {/* Dashboard Use */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Using the Dashboard
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Each role has a unique dashboard and sidebar with relevant
                options:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-300">
                <li>
                  <strong>Owner:</strong> Manage organizations, members, and
                  criteria.
                </li>
                <li>
                  <strong>Supervisor:</strong> Rate employees and view
                  performance.
                </li>
                <li>
                  <strong>Employee:</strong> View personal ratings and feedback.
                </li>
              </ul>
            </div>

            {/* Authentication */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                User Authentication
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                To access the dashboard and features, users must be
                authenticated. You can sign in using your registered email and
                password. Once logged in, a secure token is stored in your
                browser to keep you signed in during your session.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-300">
                <li>
                  You must log in to access your organization and role-specific
                  features.
                </li>
                <li>
                  Your session remains active unless you log out or the token
                  expires.
                </li>
                <li>
                  Only authenticated users can create or join organizations.
                </li>
              </ul>
            </div>

            {/* Settings */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Themes & Preferences
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                You can change the app's appearance using the settings page.
                Options include light mode, dark mode, or using your system's
                default.
              </p>
            </div>

            {/* Support */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Need more help?
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                If you’re facing issues or have questions not covered here,
                please contact our support team at{" "}
                <a
                  href="sabesh769@gmail.com"
                  className="text-indigo-600 underline"
                >
                  sabesh769@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

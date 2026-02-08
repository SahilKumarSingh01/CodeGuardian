import React from "react";

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        📑 CodeGuardian Verification Flow
      </h1>

      <p className="mb-6 text-sm sm:text-base leading-loose">
        To run your purchased software, your code must send a verification request to our server. 
        This ensures only authorized users can run the software.
      </p>

      {/* Step 1 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          🔽 Step 1: Load your reference.dat
        </h2>
        <p className="text-sm sm:text-base leading-loose">
          Your account provides a unique <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">reference.dat</code> file. 
          Make sure this file is present on your system where your code will run.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ⚙️ Step 2: Send Verification Request
        </h2>
        <p className="mb-4 text-sm sm:text-base leading-loose">
          In your code, send a POST request to our verification endpoint:
        </p>
        <pre className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`POST ${import.meta.env.VITE_SERVER_URL}/test
Content-Type: application/json

{
  "reference": "<contents of reference.dat>",
  "fingerprint": "<any string to identify your device>",
  "random": "<random number>"
}`}
        </pre>
        <p className="text-sm sm:text-base leading-loose mt-2">
          The `random` number can be any number you generate, it will be echoed back if successful.
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ✅ Step 3: Handle Response
        </h2>
        <p className="mb-2 text-sm sm:text-base leading-loose">
          If the request is successful, the server will respond with:
        </p>
        <pre className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded mb-4 text-xs sm:text-sm">{`{
  "status": "success",
  "random": "<same random number you sent>"
}`}</pre>
        <p className="text-sm sm:text-base leading-loose">
          You can then safely run your software.
        </p>
      </section>

      {/* Step 4 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ⚠️ Important Notes
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base leading-loose">
          <li>Always use your personal <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">reference.dat</code> file.</li>
          <li>Do not share this file; it is unique to your account.</li>
          <li>The `fingerprint` can be any string to uniquely identify your device (e.g., system ID, machine name, hash).</li>
          <li>The server will always echo back your `random` number to confirm request authenticity.</li>
        </ul>
      </section>

      {/* Step 5 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          📌 Example (pseudo-code)
        </h2>
        <pre className="bg-gray-900 text-blue-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`// Load reference.dat from your system
const reference = loadReference("reference.dat");
const fingerprint = "MY-MACHINE-123";
const random = Math.floor(Math.random() * 1000000);

const payload = {
  reference,
  fingerprint,
  random
};

const response = await fetch("${import.meta.env.VITE_SERVER_URL}/test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

const data = await response.json();
if (data.status === "success" && data.random === random) {
  console.log("Verification passed. Run software.");
} else {
  console.error("Verification failed.");
}`}
        </pre>
      </section>
    </div>
  );
}

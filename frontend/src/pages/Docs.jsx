import React from "react";

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">

      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        📑 CodeGuardian Verification Flow
      </h1>

      <p className="mb-6 text-sm sm:text-base leading-loose">
        This system uses <code className="px-1 rounded bg-gray-100 dark:bg-gray-800">reference.dat</code> as a license file.
        Your software must locally validate it before running, and then verify it with the server.
      </p>

      {/* Step 1 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          🔽 Step 1: Parse reference.dat
        </h2>

        <p className="text-sm sm:text-base leading-loose mb-4">
          <code className="px-1 rounded bg-gray-100 dark:bg-gray-800">reference.dat</code> is a stringified JSON license object:
        </p>

        <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`{
  "refDataId": "...",
  "softwareId": "...", 
  "softwareOriginId": "mytool-v1-enterprise",
  "ticketId": "...",
  "randomNum": 348923,
  "signature": "..."
}`}
        </pre>
      </section>

      {/* Step 2 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ✅ Step 2: Local Software Verification (MANDATORY)
        </h2>

        <p className="text-sm sm:text-base leading-loose mb-4">
          Extract <b>softwareOriginId</b> and verify it matches the embedded product identity inside the software.
        </p>

        <pre className="bg-gray-900 text-blue-400 p-3 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`if (refObj.softwareOriginId !== EMBEDDED_SOFTWARE_ORIGIN_ID) {
  blockExecution();
}`}
        </pre>

        <p className="text-sm sm:text-base leading-loose mt-3 text-red-500">
          ❗ If softwareOriginId does not match → do not run the software
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ⚙️ Step 3: Server Verification
        </h2>

        <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`POST /test
Content-Type: application/json

{
  "reference": "<contents of reference.dat>",
  "fingerprint": "<device identifier>",
  "random": "<random number>"
}`}
        </pre>
      </section>

      {/* Step 4 */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          📥 Server Response
        </h2>

        <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`{
  "status": "success",
  "random": "<same random number you sent>"
}`}
        </pre>
      </section>

      {/* Execution Rule */}
      <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ▶ Execution Rule
        </h2>

        <pre className="bg-gray-900 text-purple-400 p-3 rounded-lg text-xs sm:text-sm">
{`Parse license → Verify softwareOriginId → Verify server → Run software`}
        </pre>
      </section>

      {/* Example */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          📌 Minimal Example
        </h2>

        <pre className="bg-gray-900 text-blue-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`const refStr = loadFile("reference.dat");
const refObj = JSON.parse(refStr);

// Local license binding (product identity check)
if (refObj.softwareOriginId !== EMBEDDED_SOFTWARE_ORIGIN_ID) {
  throw new Error("Invalid license for this software product");
}

const fingerprint = getDeviceFingerprint();
const random = Math.floor(Math.random() * 1000000);

const payload = {
  reference: refStr,
  fingerprint,
  random
};

const res = await fetch("/test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

const data = await res.json();

if (data.status === "success" && data.random === random) {
  runSoftware();
} else {
  blockExecution();
}`}
        </pre>
      </section>

    </div>
  );
}

import React from "react";

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        📑 CodeGuardian Software Verification
      </h1>

      <p className="mb-10 text-sm sm:text-base leading-loose">
        To ensure security and fair use, every user is provided with a unique{" "}
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">
          reference.dat
        </code>{" "}
        file. This file is digitally signed and required to run the software.
      </p>

      {/* Step 1 */}
      <section className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          🔽 Step 1: Download your reference.dat
        </h2>
        <p className="text-sm sm:text-base leading-loose">
          Each user must download their personalized{" "}
          <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">
            reference.dat
          </code>{" "}
          file from their account dashboard. This file is unique to you and cannot be shared.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ⚙️ Step 2: Build Verification Request
        </h2>
        <p className="mb-4 text-sm sm:text-base leading-loose">
          Before the software runs, it sends a verification request to our secure backend server.
        </p>
        <pre className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`// Example JSON POST request
{
  "reference":   "<contents of reference.dat>",
  "fingerprint": "<any string to uniquely identify your device>",
  "random":      "<random number>"
}`}
        </pre>
      </section>

      {/* Step 3 */}
      <section className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          🌐 Step 3: Send Request to Backend
        </h2>
        <p className="text-sm sm:text-base leading-loose">
          The verification endpoint is:
          <br />
          <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">
            POST {`${import.meta.env.VITE_SERVER_URL}/test`}
          </code>
        </p>
      </section>

      {/* Step 4 */}
      <section className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          ✅ Step 4: Check Response
        </h2>
        <p className="mb-2 text-sm sm:text-base leading-loose">
          If the response contains:
        </p>
        <pre className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded mb-4 text-xs sm:text-sm">{`{ "status": "YES" }`}</pre>
        <p className="mb-4 text-sm sm:text-base leading-loose">
          → Your software is authorized and will run.
        </p>
        <p className="mb-2 text-sm sm:text-base leading-loose">
          Otherwise, if the response says:
        </p>
        <pre className="bg-gray-900 text-red-400 p-2 sm:p-3 rounded mb-4 text-xs sm:text-sm">{`{ "status": "NO" }`}</pre>
        <p className="text-sm sm:text-base leading-loose">
          → Your software cannot run. Please check your{" "}
          <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">
            reference.dat
          </code>{" "}
          file and try again.
        </p>
      </section>

      {/* Security Notes */}
      <section className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">🛡️ Security Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base leading-loose">
          <li>
            Your{" "}
            <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">
              reference.dat
            </code>{" "}
            file is signed and unique to you.
          </li>
          <li>
            Never share your{" "}
            <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm">
              reference.dat
            </code>{" "}
            with others.
          </li>
          <li>
            The fingerprint can be any string you choose to identify your device (e.g., device ID,
            system hash).
          </li>
        </ul>
      </section>

      {/* Example */}
      <section className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4">
          📌 Example in C++ (pseudo-code)
        </h2>
        <pre className="bg-gray-900 text-blue-400 p-3 sm:p-4 rounded-lg text-xs sm:text-sm overflow-x-auto">
{`json postData;
postData["reference"]   = loadReference(); // load your reference.dat
postData["fingerprint"] = "MY-LAPTOP-123";
postData["random"]      = generateRandom();

auto response = sendPost("${import.meta.env.VITE_SERVER_URL}/test", postData);

if (response["status"] == "YES") {
    runSoftware();
} else {
    denyAccess();
}`}
        </pre>
      </section>
      {/* Step 4 */}
    <section className="mb-10">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">
        🔄 Step 5: Per-User Reference Replacement
      </h2>
      <p className="mb-2">
        When you (the developer) test your software, you use your own{" "}
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm sm:text-base">
          reference.dat
        </code>{" "}
        file. Once your software is working and you upload it to our platform:
      </p>
      <p className="mb-2">
        Each time a buyer purchases the software, their unique{" "}
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm sm:text-base">
          reference.dat
        </code>{" "}
        automatically replaces your original reference file. This ensures:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Only the latest purchaser’s reference file is valid for running the software.</li>
        <li>Your test reference.dat stops being valid once a buyer’s file replaces it.</li>
        <li>This prevents sharing or running the software without proper authorization.</li>
      </ul>
    </section>

    </div>
  );
}

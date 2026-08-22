import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState(
    "You have successfully activated the service."
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const status = params.get("status");
    const token = params.get("token");
    const errorMessage = params.get("message");
    const msisdn = params.get("msisdn");
    if (msisdn) {
      localStorage.setItem("mobile", msisdn);
    }
    if (status === "success" && token) {
      const authData = {
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      localStorage.setItem("authData", JSON.stringify(authData));

      setSuccess(true);
      setMessage("You have successfully activated the service.");
    } else {
      setSuccess(false);
      setMessage(errorMessage || "Insufficient balance.");
    }

    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div
        className={`max-w-md w-full rounded-xl shadow-lg p-6 text-center ${
          success
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="text-5xl mb-4">{success ? "✅" : "❌"}</div>

        <h1
          className={`text-2xl font-bold mb-2 ${
            success ? "text-green-700" : "text-red-700"
          }`}
        >
          {success ? "Subscription Activated" : "Subscription Failed"}
        </h1>

        <p className="text-gray-700">{message}</p>

        <p className="text-sm text-gray-500 mt-3">
          Redirecting to homepage in 3 seconds...
        </p>
      </div>
    </div>
  );
}
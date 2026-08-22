import { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const MobilePage = () => {
  // const navigate = useNavigate();

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [loading, setLoading] = useState(false);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const BUNDLE_ID = 1307;

  const sendOtp = async () => {
    if (!mobile) {
      alert("Please enter mobile number");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem('mobile' , mobile)
      const response = await axios.post(
        "https://callback.boldmediadigital.com/api/hutch/send-otp",
        {
          number: mobile,
          bundle_id: BUNDLE_ID,
        }
      );

      console.log(response.data);

      setStep("otp");

      alert("OTP sent successfully");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // const verifyOtp = async () => {
  //   if (!otp) {
  //     alert("Please enter OTP");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await axios.post(
  //       "https://callback.boldmediadigital.com/api/hutch/verify-otp",
  //       {
  //         number: mobile,
  //         bundle_id: BUNDLE_ID,
  //         otp,
  //       }
  //     );

  //     if (response.data.success) {
  //       localStorage.setItem(
  //         "authToken",
  //         response.data.token
  //       );

  //       localStorage.setItem(
  //         "mobile",
  //         mobile
  //       );

  //       alert("Subscription successful");

  //       navigate("/");
  //     }
  //   } catch (error: any) {
  //     console.error(error);

  //     alert(
  //       error?.response?.data?.message ||
  //         "Invalid OTP"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

   const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://callback.boldmediadigital.com/api/hutch/verify-otp",
        {
          number: mobile,
          bundle_id: BUNDLE_ID,
          otp,
        }
      );

      // Backend returns the URL to redirect to
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
        return;
      }

      alert("Unexpected response from server.");
    } catch (error: any) {
      console.error(error);

      // Even on failure, backend may return a redirectUrl
      if (error.response?.data?.redirectUrl) {
        window.location.href = error.response.data.redirectUrl;
        return;
      }

      alert(
        error.response?.data?.message ||
        "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Radiofyy Subscription
        </h1>

        {step === "mobile" ? (
          <>
            <label className="text-gray-300 text-sm">
              Mobile Number
            </label>

            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="947XXXXXXXX"
              className="w-full mt-2 p-3 rounded-lg border border-gray-700 bg-black text-white"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-5 bg-blue-500 hover:bg-blue-600 py-3 rounded-lg text-white font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="text-gray-300 text-sm">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mt-2 p-3 rounded-lg border border-gray-700 bg-black text-white"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-5 bg-orange-500 hover:bg-orange-600 py-3 rounded-lg text-white font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-3 border border-blue-500 text-orange-500 py-3 rounded-lg"
            >
              Resend OTP
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default MobilePage;


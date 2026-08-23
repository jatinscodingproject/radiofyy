import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import NavbarClick from "./components/NavbarClick";
import MobilePage from "./components/MobilePage";
import AuthCallback from "./components/AuthCallback";
import Globe from "./components/Globe";

import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";


function HomePage() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isOtpFlow =
    location.pathname === "/otp-flow";

  const getToken = () => {
    const authData = localStorage.getItem("authData");

    if (!authData) {
      return null;
    }

    try {
      const parsed = JSON.parse(authData);

      if (!parsed.token || !parsed.expiresAt) {
        localStorage.removeItem("authData");
        return null;
      }

      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem("authData");
        return null;
      }

      return parsed.token;

    } catch (error) {
      console.error(
        "Invalid authData:",
        error
      );

      localStorage.removeItem("authData");

      return null;
    }
  };


  const isSubscribed = !!getToken();

  const handlePlay = async () => {

    try {

      setLoading(true);

      if (isSubscribed) {

        setStarted(true);

        return;
      }

      if (isOtpFlow) {

        localStorage.setItem(
          "subscriptionFlow",
          "otp-flow"
        );

        // Same process as NavbarClick
        navigate("/subscribe");

        return;
      }


      localStorage.setItem(
        "subscriptionFlow",
        "normal"
      );


      // Detect Hutch user
      await axios.get(
        `${window.location.origin}/api/hutch/detect-user?t=${Date.now()}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );


      // Hutch consent
      window.location.href =
        "http://consent.hutch.lk/register-service/XQ%3D%3DCg%3D%3Dcg%3D%3DAw%3D%3D";


    } catch (error) {

      console.error(
        "Subscription error:",
        error
      );


      if (!isOtpFlow) {

        window.location.href =
          "http://consent.hutch.lk/register-service/XQ%3D%3DCg%3D%3Dcg%3D%3DAw%3D%3D";

      } else {
        navigate("/subscribe");
      }


    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="relative h-screen w-screen overflow-hidden bg-[#020617]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center,#0f172a 0%,#020617 60%,#000000 100%)",
        }}
      />


      {!started ? (

        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-md">

          <div className="text-center px-6">

            <h1 className="mb-4 text-4xl font-bold text-white">
              RadioFyy
            </h1>


            <p className="mb-10 text-gray-300 text-lg">
              Discover and listen to radio stations from around the world.
            </p>


            <button
              onClick={handlePlay}
              disabled={loading}
              className="flex items-center gap-3 rounded-full bg-green-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-600 mx-auto disabled:opacity-50"
            >

              <Play className="h-6 w-6 fill-white" />


              {loading
                ? "Checking..."
                : isSubscribed
                ? "Tap to Play"
                : "Subscribe & Play"}

            </button>

          </div>

        </div>

      ) : (

        <main className="absolute inset-0 pt-20">

          <Globe />

        </main>

      )}

    </div>
  );
}


function AppLayout() {
  const location = useLocation();
  const isCallbackPage =
    location.pathname === "/auth/callback";
  const isOtpFlow =
    location.pathname === "/otp-flow";
  const params =
    new URLSearchParams(
      window.location.search
    );
  const extRef =
    params.get("ext_ref");
  useEffect(() => {
    if (isOtpFlow) {
      return;
    }
    axios
      .get(
        `${window.location.origin}/api/hutch/detect-user`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },

          params: {
            ext_ref: extRef,

            origin:
              "http://sl.yumzyy.com",
          },
        }
      )
      .catch(console.error);

  }, [extRef, isOtpFlow]);


  return (

    <>
      {!isCallbackPage && (

        isOtpFlow
          ? <NavbarClick />
          : <Navbar />

      )}


      <Routes>

        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/otp-flow"
          element={
            <HomePage />
          }
        />

        <Route
          path="/subscribe"
          element={
            <MobilePage />
          }
        />

        <Route
          path="/auth/callback"
          element={
            <AuthCallback />
          }
        />

      </Routes>

    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>

  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe2, Menu, X } from "lucide-react";
import axios from "axios";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // CHECK TOKEN
  // =========================
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
      console.error("Invalid authData:", error);

      localStorage.removeItem("authData");
      return null;
    }
  };

  const token = getToken();
  const isSubscribed = !!token;

  // =========================
  // SUBSCRIBE
  // =========================
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Go to your login/mobile page
      navigate("/subscribe");

    } catch (error) {
      console.error("Subscribe error:", error);

      navigate("/subscribe");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UNSUBSCRIBE
  // =========================
  const handleLogout = async () => {
    try {
      setLoading(true);

      const mobile = localStorage.getItem("mobile");

      if (!mobile) {
        alert("Mobile number not found.");
        return;
      }

      await axios.post(
        `${window.location.origin}/api/hutch/unsubscribe`,
        {
          number: mobile,
          bundle_id: "1307",
        }
      );

      // Clear authentication
      localStorage.removeItem("authData");
      localStorage.removeItem("mobile");

      alert("You have successfully unsubscribed.");

      // Go to home
      navigate("/");
      window.location.reload();

    } catch (error) {
      console.error("Unsubscribe Error:", error);

      alert("Failed to unsubscribe. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="absolute top-3 left-3 right-3 z-50">

      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-2 sm:p-3">
              <Globe2 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>

            <h1 className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
              RadioFyy
            </h1>

          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base text-gray-300">

            <button
              className="transition hover:text-white"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              className="transition hover:text-white"
              onClick={() => navigate("/terms")}
            >
              Terms & Conditions
            </button>

            {/* Subscribe / Unsubscribe */}
            {!isSubscribed ? (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="rounded-full bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Subscribe"}
              </button>
            ) : (
              <button
                onClick={handleLogout}
                disabled={loading}
                className="rounded-full border border-red-500 px-5 py-2 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                {loading ? "Processing..." : "Unsubscribe"}
              </button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-white/10 md:hidden">

            <button
              className="block w-full px-6 py-4 text-left text-white hover:bg-white/10"
              onClick={() => {
                setMenuOpen(false);
                navigate("/");
              }}
            >
              Home
            </button>

            <button
              className="block w-full px-6 py-4 text-left text-white hover:bg-white/10"
              onClick={() => {
                setMenuOpen(false);
                navigate("/terms");
              }}
            >
              Terms & Conditions
            </button>

            {/* Mobile Subscribe / Unsubscribe */}
            {!isSubscribed ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSubscribe();
                }}
                disabled={loading}
                className="mx-6 my-4 block w-[calc(100%-3rem)] rounded-full bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Subscribe"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                disabled={loading}
                className="mx-6 my-4 block w-[calc(100%-3rem)] rounded-full border border-red-500 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                {loading ? "Processing..." : "Unsubscribe"}
              </button>
            )}

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
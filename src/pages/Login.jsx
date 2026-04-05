import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE from "../config/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Login gagal");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user.id);

      showToast("Login berhasil");

      setTimeout(() => {
        window.location.href = "/home";
      }, 700);
    } catch {
      showToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.iconBox}>
          <FaBookOpen />
        </div>

        <h1 style={styles.title}>
          <span
            style={{
              color: "#fff",
              textShadow: "0 0 8px rgba(30,58,138,0.5)",
            }}
          >
            Welcome
          </span>{" "}
          <span
            style={{
              color: "#60a5fa",
              textShadow: "0 0 8px rgba(59,130,246,0.35)",
            }}
          >
            Back
          </span>
        </h1>

        <p style={styles.subtitle}>
          Login untuk melanjutkan ke My Library
        </p>

        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.passwordInput}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.bottomText}>
            Belum punya akun?{" "}
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </p>
        </div>
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

export default Login;

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1a2740 0%, #0b1020 40%, #070b14 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    animation: "fadeUp 0.35s ease",
  },

  iconBox: {
    width: "64px",
    height: "64px",
    borderRadius: "22px",
    margin: "0 auto 16px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    boxShadow: "0 14px 30px rgba(37,99,235,0.35)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  subtitle: {
    margin: "10px auto 22px",
    textAlign: "center",
    fontSize: "13px",
    color: "#8f9bb3",
    maxWidth: "320px",
    lineHeight: "1.6",
  },

  card: {
    background: "rgba(18,26,45,0.92)",
    borderRadius: "26px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    backdropFilter: "blur(16px)",
  },

  field: {
    marginBottom: "14px",
  },

  label: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    background: "#0b1220",
    border: "1px solid rgba(255,255,255,0.04)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  passwordWrap: {
    position: "relative",
  },

  passwordInput: {
    width: "100%",
    padding: "13px 44px 13px 14px",
    borderRadius: "14px",
    background: "#0b1220",
    border: "1px solid rgba(255,255,255,0.04)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  eyeBtn: {
    position: "absolute",
    top: "50%",
    right: "12px",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "13px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    marginTop: "4px",
    boxShadow: "0 12px 24px rgba(37,99,235,0.28)",
  },

  bottomText: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "13px",
    color: "#94a3b8",
  },

  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "700",
  },

  toast: {
    position: "fixed",
    left: "50%",
    bottom: "36px",
    transform: "translateX(-50%)",
    background: "#172235",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "12px",
    fontSize: "13px",
    animation: "slideUp 0.3s ease",
    zIndex: 9999,
  },
};
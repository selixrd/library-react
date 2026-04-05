import { useEffect, useState, useRef } from "react";
import { FaUser } from "react-icons/fa6";
import BottomNav from "../components/BottomNav";
import API_BASE from "../config/api";

function Profile() {
  const userId = localStorage.getItem("user_id");

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [preview, setPreview] = useState(null);

  const [studentFullName, setStudentFullName] = useState("");
  const [nis, setNis] = useState("");
  const [className, setClassName] = useState("");
  const [major, setMajor] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState("");
  const fileInputRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    const savedPreview = localStorage.getItem("preview");

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);

      setProfile(parsed);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setStudentFullName(parsed.student_name || "");
      setNis(parsed.nis || "");
      setClassName(parsed.class || "");
      setMajor(parsed.major || "");
      setAddress(parsed.address || "");
    }

    if (savedPreview) {
      setPreview(savedPreview);
    }

    fetch(`${API_BASE}/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
  setProfile(data);
  localStorage.setItem("profile", JSON.stringify(data));

  if (data.photo) {
    setPreview(data.photo);
    localStorage.setItem("preview", data.photo);
  } else {
    setPreview(null);
    localStorage.removeItem("preview");
  }

  setName(data.name || "");
  setEmail(data.email || "");
  setStudentFullName(data.student_name || "");
  setNis(data.nis || "");
  setClassName(data.class || "");
  setMajor(data.major || "");
  setAddress(data.address || "");
})
      .catch(() => setProfile({}));
  }, [userId]);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.hero}>
          <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    localStorage.setItem("preview", previewUrl);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch(`${API_BASE}/api/profile/photo`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
  const updatedProfile = {
    ...(profile || {}),
    photo: data.photo,
  };

  setProfile(updatedProfile);
  localStorage.setItem("profile", JSON.stringify(updatedProfile));

  setPreview(data.photo);
  localStorage.setItem("preview", data.photo);

  showToast("Foto berhasil diupdate");
} else {
  showToast(data.message || "Gagal upload foto");
}
    } catch {
      showToast("Gagal upload foto");
    }

    e.target.value = null;
  }}
/>

          <div
            style={styles.avatar}
            onClick={() => fileInputRef.current.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(59,130,246,0.4), 0 8px 20px rgba(0,0,0,0.5)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {preview ? (
  <img
    src={preview}
    onError={() => {
      setPreview(null);
      localStorage.removeItem("preview");
    }}
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />
) : profile?.photo ? (
  <img
    src={profile.photo}
    onError={() => {
      const clearedProfile = {
        ...(profile || {}),
        photo: null,
      };

      setProfile(clearedProfile);
      localStorage.setItem("profile", JSON.stringify(clearedProfile));
    }}
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />
) : (
  (profile?.name?.[0] || name?.[0] || "A").toUpperCase()
)}
          </div>

          <div>
            <h1 style={styles.title}>
              <span
                style={{
                  color: "#fff",
                  textShadow: "0 0 8px rgba(30,58,138,0.5)",
                }}
              >
                My
              </span>{" "}
              <span
                style={{
                  color: "#1e3a8a",
                  textShadow: "0 0 8px rgba(30,58,138,0.5)",
                }}
              >
                Profile
              </span>
            </h1>
            <p style={styles.subtitle}>Akun dan identitas siswa</p>
          </div>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileTop}>
            <div style={styles.profileMini}>
              <FaUser />
            </div>
            <div>
              <p style={styles.profileName}>{profile?.name ?? "User"}</p>
              <p style={styles.profileEmail}>{profile?.email ?? "-"}</p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Informasi Akun</h3>

          <div style={styles.row}>
            <span style={styles.label}>Nama</span>
            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            ) : (
              <span style={styles.value}>{profile?.name ?? "-"}</span>
            )}
          </div>

          <div style={{ ...styles.row, borderBottom: "none" }}>
            <span style={styles.label}>Email</span>
            {editMode ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            ) : (
              <span style={styles.value}>{profile?.email ?? "-"}</span>
            )}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Identitas Siswa</h3>

          {[
            ["Nama Lengkap", studentFullName, setStudentFullName, "student_name"],
            ["NIS", nis, setNis, "nis"],
            ["Kelas", className, setClassName, "class"],
            ["Jurusan", major, setMajor, "major"],
            ["Alamat", address, setAddress, "address"],
          ].map(([label, value, setter, key], i) => (
            <div key={i} style={styles.row}>
              <span style={styles.label}>{label}</span>
              {editMode ? (
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={styles.input}
                />
              ) : (
                <span style={styles.value}>{profile?.[key] ?? "-"}</span>
              )}
            </div>
          ))}

          <div style={{ marginTop: "12px" }}>
            <button
  type="button"
  style={styles.button}
  onClick={async () => {
    if (editMode) {
      if (!name || !email || !studentFullName || !nis || !className || !major || !address) {
        showToast("Lengkapi semua data profile dulu");
        return;
      }

      try {
        // UPDATE USER (NAME + EMAIL)
        const accountResponse = await fetch(`${API_BASE}/api/profile/update-account`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              name: name,
              email: email,
            }),
          }
        );

        const accountData = await accountResponse.json();

        if (!accountResponse.ok) {
          showToast(accountData.message || "Gagal update akun");
          return;
        }

        // UPDATE STUDENT
        const response = await fetch(`${API_BASE}/api/profile/student/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              name: studentFullName,
              nis,
              class: className,
              major,
              address,
            }),
          }
        );

        const resData = await response.json();

        if (!response.ok) {
          showToast(resData.message || "Gagal menyimpan data");
          return;
        }

        const updatedProfile = {
          ...profile,
          name,
          email,
          student_name: studentFullName,
          nis,
          class: className,
          major,
          address,
        };

        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));

        showToast("Data berhasil disimpan");
        setEditMode(false);
      } catch (error) {
        showToast("Server error");
        console.error("SAVE PROFILE ERROR:", error);
      }

      return;
    }

    setEditMode(true);
  }}
>
  {editMode ? "Save" : "Edit Data"}
</button>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Keamanan</h3>

          <button
            type="button"
            style={styles.button}
            onClick={() => setShowPassword(!showPassword)}
          >
            Ganti Password
          </button>

          {showPassword && (
            <div style={styles.passwordBox}>
              <input
                type="password"
                placeholder="Password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <button
                type="button"
                style={{ ...styles.button, marginTop: "6px" }}
                onClick={async () => {
                  if (!password) return;

                  try {
                    const res = await fetch(`${API_BASE}/api/profile/password`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: userId,
                        password,
                      }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      showToast(data.message || "Password berhasil diubah");
                      setPassword("");
                      setShowPassword(false);
                    } else {
                      showToast(data.message || "Gagal ubah password");
                    }
                  } catch {
                    showToast("Gagal ubah password");
                  }
                }}
              >
                Save Password
              </button>

              <button
                type="button"
                style={{ ...styles.button, background: "#334155" }}
                onClick={() => {
                  setPassword("");
                  setShowPassword(false);
                }}
              >
                Batal
              </button>
            </div>
          )}
          <button
  type="button"
  style={styles.logoutBtn}
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("profile");
    localStorage.removeItem("preview");

    window.location.href = "/login";
  }}
>
  Logout
</button>
        </div>
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
       <BottomNav />
    </div>
  );
}

export default Profile;

const styles = {
  page: { minHeight: "100vh", color: "#fff" },

  container: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "20px 16px 100px",
  },

  hero: { display: "flex", gap: "14px", marginBottom: "18px" },

 avatar: {
  width: "64px",
  height: "64px",
  minWidth: "64px",  
  minHeight: "64px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  cursor: "pointer",
  overflow: "hidden",
  transition: "0.2s ease",
},

  title: { fontSize: "28px", fontWeight: "800" },
  subtitle: { fontSize: "13px", color: "#8f9bb3" },

  profileCard: {
    background: "#121a2d",
    borderRadius: "22px",
    padding: "16px",
    marginBottom: "14px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },

  profileTop: { display: "flex", gap: "12px" },

  profileMini: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileName: { fontWeight: "700" },
  profileEmail: { fontSize: "13px", color: "#97a3b8" },

  card: {
    background: "#121a2d",
    borderRadius: "22px",
    padding: "16px",
    marginBottom: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },

  cardTitle: { marginBottom: "14px", fontWeight: "700" },

  // FIX SPACING DI SINI
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "12px 0",
    borderBottom: "1px solid #222",
  },

  label: { color: "#94a3b8", fontSize: "12px" },
  value: { color: "#e2e8f0" },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "#0b1220",
    color: "#fff",
    border: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
  },

  passwordBox: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  toast: {
    position: "fixed",
    left: "50%",
    bottom: "80px",
    transform: "translateX(-50%)",
    background: "#172235",
    padding: "12px 18px",
    borderRadius: "12px",
    animation: "slideUp 0.3s ease",
  },

  logoutBtn: {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  background: "#1e293b", // navy gelap
  color: "#94a3b8",
  fontWeight: "600",
  border: "1px solid #334155",
  cursor: "pointer",
  marginTop: "10px",
},

};
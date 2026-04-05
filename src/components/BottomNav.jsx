import { FaHouse, FaBookmark, FaUser } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "home", path: "/home", icon: FaHouse },
    { key: "mybooks", path: "/mybooks", icon: FaBookmark },
    { key: "profile", path: "/profile", icon: FaUser },
  ];

  return (
    <div style={styles.nav}>
      {items.map((item) => {
        const Icon = item.icon;

        // DETEKSI ACTIVE DARI URL (bukan state lama)
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            style={styles.btn}
          >
            <div style={styles.wrapper}>
              {/* bubble iOS */}
              {isActive && <div style={styles.bubble}></div>}

              {/* icon */}
              <Icon style={isActive ? styles.active : styles.icon} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;

const styles = {
  nav: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "85%",
    maxWidth: 420,
    height: 65,
    background: "rgba(17,24,39,0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: 30,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    zIndex: 999,
  },

  btn: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  wrapper: {
    position: "relative",
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    color: "#6b7280",
    fontSize: 20,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 2,
  },

  active: {
    color: "#3b82f6",
    fontSize: 22,
    transform: "translateY(-6px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 2,
  },

  bubble: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(59,130,246,0.15)",
    boxShadow: "0 0 20px rgba(59,130,246,0.4)",
    zIndex: 1,
  },
};
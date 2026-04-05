import { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import BottomNav from "../components/BottomNav";
import API_BASE from "../config/api";

function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeBorrowCount, setActiveBorrowCount] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetch(`${API_BASE}/api/books`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (!userId) return;

    fetch(`${API_BASE}/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        localStorage.setItem("profile", JSON.stringify(data));

        const isProfileIncomplete =
          !data.student_name ||
          !data.nis ||
          !data.class ||
          !data.major ||
          !data.address;

        setShowProfileModal(isProfileIncomplete);
      })
      .catch(() => {
        const savedProfile = localStorage.getItem("profile");

        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);

          const isProfileIncomplete =
            !parsed.student_name ||
            !parsed.nis ||
            !parsed.class ||
            !parsed.major ||
            !parsed.address;

          setShowProfileModal(isProfileIncomplete);
        } else {
          setShowProfileModal(true);
        }
      });

    fetch(`${API_BASE}/api/my-books?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((b) => !b.return_date).length;
        setActiveBorrowCount(active);
      })
      .catch(() => setActiveBorrowCount(0));
  }, [userId]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const handleBorrow = async (id) => {
    if (activeBorrowCount >= 3) {
      showToast("Maksimal 3 buku sedang dipinjam");
      return;
    }

    if (
      !profile ||
      !profile.student_name ||
      !profile.nis ||
      !profile.class ||
      !profile.major ||
      !profile.address
    ) {
      showToast("Lengkapi profile dulu ya!");

      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);

      return;
    }

    try {
      setBorrowingId(id);

      const res = await fetch(`${API_BASE}/api/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          book_id: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Gagal meminjam buku");
        return;
      }

      showToast(data.message);

      const updated = await fetch(`${API_BASE}/api/books`);
      const booksData = await updated.json();
      setBooks(booksData);

      const myBooks = await fetch(
        `${API_BASE}/api/my-books?user_id=${userId}`
      );
      const myData = await myBooks.json();
      const active = myData.filter((b) => !b.return_date).length;
      setActiveBorrowCount(active);

      setSelectedBook(null);
    } catch {
      showToast("Server error");
    } finally {
      setBorrowingId(null);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }

        @keyframes slideUp {
          from { transform: translateY(16px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.hero}>
          <p style={styles.kicker}>Choose Your Story</p>

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
              Library
            </span>
          </h1>

          <p style={styles.subtitle}>
            Explore books that match your mood and moment
          </p>
        </div>

        <div style={styles.searchWrap}>
          <FaMagnifyingGlass style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.grid}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={styles.skeletonCard}>
                  <div style={styles.skeletonImage}></div>
                  <div style={styles.skeletonLine}></div>
                  <div style={styles.skeletonSmall}></div>
                  <div style={styles.skeletonButton}></div>
                </div>
              ))
            : filteredBooks.map((book) => (
                <div
                  key={book.id}
                  style={styles.card}
                  onClick={() => setSelectedBook(book)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-6px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.35), 0 0 20px rgba(59,130,246,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.22)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={
                      book.cover
                        ? `${API_BASE}/${book.cover}`
                        : "https://via.placeholder.com/200x300?text=No+Cover"
                    }
                    alt={book.title}
                    style={styles.image}
                  />

                  <div style={styles.info}>
                    <h3 style={styles.bookTitle}>{book.title}</h3>
                    <p style={styles.author}>{book.author}</p>

                    <button
                      disabled={
                        activeBorrowCount === null ||
                        book.stock <= 0 ||
                        borrowingId === book.id
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBorrow(book.id);
                      }}
                      style={{
                        ...styles.borrowSmall,
                        opacity:
                          activeBorrowCount === null ||
                          book.stock <= 0 ||
                          activeBorrowCount >= 3
                            ? 0.6
                            : 1,
                        cursor:
                          activeBorrowCount === null ||
                          book.stock <= 0 ||
                          activeBorrowCount >= 3
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {borrowingId === book.id
                        ? "Loading..."
                        : activeBorrowCount === null
                        ? "Loading..."
                        : book.stock <= 0
                        ? "Out of Stock"
                        : activeBorrowCount >= 3
                        ? "Limit Reached"
                        : "Borrow"}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {selectedBook && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedBook(null)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.close}
              onClick={() => setSelectedBook(null)}
            >
              <FaXmark />
            </button>

            <img
              src={
                selectedBook.cover
                  ? `${API_BASE}/${selectedBook.cover}`
                  : "https://via.placeholder.com/300x400?text=No+Cover"
              }
              alt={selectedBook.title}
              style={styles.modalImage}
            />

            <div style={styles.modalContent}>
              <p style={styles.modalTag}>Featured Book</p>
              <h2 style={styles.modalTitle}>{selectedBook.title}</h2>
              <p style={styles.modalAuthor}>{selectedBook.author}</p>

              <div style={styles.metaInline}>
                <span>{selectedBook.year ?? "-"}</span>
                <span>•</span>
                <span>{selectedBook.category ?? "Novel"}</span>
                <span>•</span>
                <span>Stock {selectedBook.stock ?? 10}</span>
                <span>•</span>
                <span style={styles.available}>Available</span>
              </div>

              <p style={styles.desc}>
                {selectedBook.description ?? "No description available."}
              </p>

              <button
                disabled={
                  activeBorrowCount === null ||
                  selectedBook.stock <= 0 ||
                  borrowingId === selectedBook.id
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleBorrow(selectedBook.id);
                }}
                style={{
                  ...styles.borrowSmall,
                  opacity:
                    activeBorrowCount === null ||
                    selectedBook.stock <= 0 ||
                    activeBorrowCount >= 3
                      ? 0.6
                      : 1,
                  cursor:
                    activeBorrowCount === null ||
                    selectedBook.stock <= 0 ||
                    activeBorrowCount >= 3
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {borrowingId === selectedBook.id
                  ? "Loading..."
                  : activeBorrowCount === null
                  ? "Loading..."
                  : selectedBook.stock <= 0
                  ? "Out of Stock"
                  : activeBorrowCount >= 3
                  ? "Limit Reached"
                  : "Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            style={styles.profileModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.profileModalTitle}>Lengkapi Profile Dulu</h2>

            <p style={styles.profileModalText}>
              Isi data diri dulu sebelum pinjam buku ya
            </p>

            <div style={styles.profileModalActions}>
              <button
                style={styles.profileNowBtn}
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                Isi Sekarang
              </button>

              <button
                style={styles.profileLaterBtn}
                onClick={() => setShowProfileModal(false)}
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
      <BottomNav />
    </div>
  );
}

export default Home;

const shimmer = {
  background:
    "linear-gradient(90deg, rgba(22,30,49,1) 25%, rgba(33,44,68,1) 50%, rgba(22,30,49,1) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.2s infinite",
};

const styles = {
  page: {
    minHeight: "100vh",
    color: "#fff",
  },

  container: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "20px 16px 100px",
  },

  hero: {
    marginBottom: "18px",
    textAlign: "center",
  },

  kicker: {
    margin: "0 0 6px",
    color: "#60a5fa",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    lineHeight: "1.1",
  },

  subtitle: {
    margin: "8px 0 0",
    fontSize: "13px",
    fontWeight: "400",
    color: "#91a0b8",
    lineHeight: "1.6",
  },

  searchWrap: {
    position: "relative",
    marginBottom: "18px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#7f8aa3",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px 14px 14px 42px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(13,18,30,0.85)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  card: {
    background: "#0f172a",
    borderRadius: "22px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "contain",
    background: "#0b1220",
    display: "block",
    padding: "6px",
    borderRadius: "16px",
  },

  info: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
  },

  bookTitle: {
    margin: "0 0 4px",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.35",
    minHeight: "48px",
    letterSpacing: "-0.01em",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  author: {
    margin: "0 0 6px",
    fontSize: "12px",
    fontWeight: "400",
    color: "#aab4c8",
    lineHeight: "1.3",
  },

  borrowSmall: {
    marginTop: "6px",
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #3b82f6 0%, #2563eb 60%, #1d4ed8 100%)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  skeletonCard: {
    background: "#101829",
    borderRadius: "22px",
    padding: "12px",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  skeletonImage: {
    ...shimmer,
    height: "220px",
    borderRadius: "16px",
    marginBottom: "12px",
  },

  skeletonLine: {
    ...shimmer,
    height: "14px",
    borderRadius: "8px",
    marginBottom: "8px",
  },

  skeletonSmall: {
    ...shimmer,
    height: "12px",
    width: "60%",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  skeletonButton: {
    ...shimmer,
    height: "40px",
    borderRadius: "12px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(4,8,16,0.78)",
    backdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    maxHeight: "88vh",
    overflowY: "auto",
    background: "#101829",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "28px",
    position: "relative",
    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
  },

  close: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    border: "none",
    background: "rgba(0,0,0,0.38)",
    color: "#fff",
    cursor: "pointer",
    zIndex: 2,
  },

  modalImage: {
    width: "100%",
    height: "300px",
    objectFit: "contain",
    background: "#0b1220",
    display: "block",
    padding: "14px",
    borderTopLeftRadius: "28px",
    borderTopRightRadius: "28px",
  },

  modalContent: {
    padding: "18px",
  },

  modalTag: {
    margin: "0 0 8px",
    fontSize: "11px",
    color: "#60a5fa",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },

  modalAuthor: {
    margin: "6px 0 10px",
    fontSize: "14px",
    color: "#95a3bb",
  },

  metaInline: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#9aa8be",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  available: {
    color: "#22c55e",
    fontWeight: "600",
  },

  desc: {
    marginTop: "14px",
    fontSize: "13px",
    color: "#d4dbe6",
    lineHeight: "1.85",
  },

  toast: {
    position: "fixed",
    left: "50%",
    bottom: "88px",
    transform: "translateX(-50%)",
    background: "#172235",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "12px",
    fontSize: "13px",
    zIndex: 1100,
  },

  profileModal: {
  width: "100%",
  maxWidth: "360px",
  background: "#121a2d",
  borderRadius: "22px",
  padding: "22px",
},

profileModalTitle: {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "10px",
},

profileModalText: {
  fontSize: "14px",
  color: "#aab4c8",
},

profileModalActions: {
  marginTop: "15px",
  display: "flex",
  gap: "10px",
},

profileNowBtn: {
  flex: 1,
  padding: "10px",
  background: "#2563eb",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
},

profileLaterBtn: {
  flex: 1,
  padding: "10px",
  background: "#334155",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
},

};
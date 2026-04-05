import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa6";
import BottomNav from "../components/BottomNav";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import API_BASE from "../config/api";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    fetch(`${API_BASE}/api/my-books?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.top}>
          <div style={styles.iconWrap}>
            <FaBookmark />
          </div>

          <div>
            <h1 style={styles.title}>
              <span
                style={{
                  color: "#fff",
                  textShadow: "0 0 8px rgba(30,58,138,0.5)"
                }}
              >
                My
              </span>{" "}
              <span
                style={{
                  color: "#1e3a8a",
                  textShadow: "0 0 8px rgba(30,58,138,0.5)"
                }}
              >
                Books
              </span>
            </h1>

            <p style={styles.subtitle}>Daftar buku yang kamu pinjam</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.card}>
            <p style={styles.text}>Loading...</p>
          </div>
        ) : books.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyTitle}>Belum ada buku dipinjam</p>
            <p style={styles.text}>Mulai pinjam buku dari Home</p>
          </div>
        ) : (
          books.map((item) => (
            <div key={item.id} style={styles.card}>
  <h3 style={styles.bookTitle}>{item.book?.title ?? "-"}</h3>
  <p style={styles.text}>{item.book?.author ?? "-"}</p>

  <p style={styles.text}>Dipinjam: {item.borrow_date ?? "-"}</p>
  <p style={styles.text}>Kembali: {item.return_date ?? "-"}</p>

  <p
    style={{
      ...styles.status,
      padding: "4px 10px",
      borderRadius: "999px",
      background: item.return_date
        ? "rgba(56,189,248,0.15)"
        : "rgba(96,165,250,0.15)",
      color: item.return_date ? "#38bdf8" : "#60a5fa",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: "600"
    }}
  >
    {item.return_date ? (
      <FaCheckCircle size={12} />
    ) : (
      <FaClock size={12} />
    )}
    {item.return_date ? "Returned" : "Borrowed"}
  </p>
</div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default MyBooks;

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

  top: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
  },

  iconWrap: {
    width: "54px",
    height: "54px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 24px rgba(37,99,235,0.25)",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  subtitle: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#8f9bb3",
  },

  emptyCard: {
    background: "linear-gradient(180deg, #121a2d 0%, #0d1423 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "22px",
    padding: "24px 18px",
    textAlign: "left",
    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    fontWeight: "700",
  },

  card: {
    background: "linear-gradient(180deg, #121a2d 0%, #0d1423 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "22px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
  },

  bookTitle: {
    margin: "0 0 4px",
    fontSize: "16px",
    fontWeight: "600",
  },

  text: {
    margin: "0 0 6px",
    fontSize: "14px",
    color: "#9aa7bc",
  },

  status: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "#60a5fa",
    fontWeight: "600",
  },
};
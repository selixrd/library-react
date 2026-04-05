function BookCard({ book, onClick, onBorrow }) {
  return (
    <div
      className="book-card"
      onClick={onClick}
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 25px 50px rgba(37,99,235,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.25)";
      }}
    >
      <img
        src={`http://127.0.0.1:8000/storage/${book.cover}`}
        alt={book.title}
        style={styles.image}
      />

      <div style={styles.info}>
        <h3 style={styles.title}>{book.title}</h3>
        <p style={styles.author}>{book.author}</p>
      </div>

      <div style={styles.footer}>
        <button
          style={styles.button}
          onClick={(e) => {
            e.stopPropagation();
            onBorrow(book.id);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Borrow
        </button>
      </div>
    </div>
  );
}

export default BookCard;

const styles = {
  card: {
    background: "linear-gradient(180deg, #151c2c 0%, #0f172a 100%)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
  },

  image: {
    width: "100%",
    height: "210px",
    objectFit: "cover"
  },

  info: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },

  title: {
    fontSize: "14px",
    lineHeight: "1.35",
    margin: 0,
    color: "#fff",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "38px"
  },

  author: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0
  },

  footer: {
    padding: "12px",
    marginTop: "auto"
  },

  button: {
    width: "100%",
    padding: "11px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 8px 20px rgba(37,99,235,0.25)"
  }
};
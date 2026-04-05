function Skeleton() {
  return (
    <div style={styles.card}>
      <div style={styles.image}></div>
      <div style={styles.line}></div>
      <div style={styles.smallLine}></div>
      <div style={styles.button}></div>
    </div>
  );
}

export default Skeleton;

const shimmer = {
  background: "linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.2s infinite linear",
};

const styles = {
  card: {
    background: "#171717",
    borderRadius: "18px",
    padding: "12px",
    border: "1px solid #242424"
  },

  image: {
    ...shimmer,
    height: "210px",
    borderRadius: "14px",
    marginBottom: "12px"
  },

  line: {
    ...shimmer,
    height: "14px",
    borderRadius: "8px",
    marginBottom: "8px"
  },

  smallLine: {
    ...shimmer,
    height: "12px",
    width: "65%",
    borderRadius: "8px",
    marginBottom: "14px"
  },

  button: {
    ...shimmer,
    height: "40px",
    borderRadius: "12px"
  }
};
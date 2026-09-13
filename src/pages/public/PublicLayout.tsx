import Navbar from "../../components/public/Navbar";
import Home from "./Home";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      <Navbar />

      <Home />
    </div>
  );
}

export default PublicLayout;
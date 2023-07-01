import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="bg-black/90">
      <Header />
      <div className="min-h-screen px-3 py-5 font-reg">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;

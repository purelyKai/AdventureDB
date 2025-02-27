import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-amber-900 text-amber-50 py-4">
        <div className="container mx-auto px-4 text-center">
          <p>AdventureDB - Your Fantasy Adventure Database</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar/Navbar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
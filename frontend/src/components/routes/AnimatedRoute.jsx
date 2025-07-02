import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import './AnimatedRoute.css';

const AnimatedRoute = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="route-container">
      <Outlet />
    </div>
  );
};

export default AnimatedRoute;
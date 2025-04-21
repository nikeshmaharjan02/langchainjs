import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white shadow p-4 mb-6">
      <div className="max-w-3xl mx-auto flex gap-6">
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            isActive
              ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
              : 'text-gray-700 hover:text-blue-600'
          }
        >
          📄 Summary
        </NavLink>
        <NavLink
          to="/qa"
          className={({ isActive }) =>
            isActive
              ? 'text-green-600 font-semibold border-b-2 border-green-600 pb-1'
              : 'text-gray-700 hover:text-green-600'
          }
        >
          💬 QA
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;

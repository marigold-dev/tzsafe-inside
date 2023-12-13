import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import dataLastUpdatedTime from '../data/lastUpdatedTime.json';

const Sidebar: React.FC = () => {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Last Updated:</h3>
        <p>{dataLastUpdatedTime.lastUpdatedTime}</p>
      </div>
      <ul>
        <li className="mb-2">
          <Link to="/stats" className="text-blue-600 hover:text-blue-800">
            Stats
          </Link>
        </li>
        <li>
          <Link to="/safes" className="text-blue-600 hover:text-blue-800">
            All Safes 
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
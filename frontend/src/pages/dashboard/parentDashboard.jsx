// App.jsx
import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const sidebarItems = [
  { name: "Dashboard" },
  { name: "Academic Progress" },
  { name: "Attendance" },
  { name: "Announcements" },
  { name: "Messages" },
  { name: "Settings" },
];

const updates = [
  { title: "Winter Break Schedule", date: "2024-12-15", type: "school", new: true },
  { title: "Parent-Teacher Conference", date: "2024-12-14", type: "class", new: true },
  { title: "Mathematics Competition", date: "2024-12-12", type: "subject", new: false },
];

const ParentDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8">Parent Portal</h2>
        <p className="text-gray-500 mb-6 text-sm">Student Management System</p>
        <nav className="flex-1">
          {sidebarItems.map((item) => (
            <div
              key={item.name}
              className="py-2 px-3 mb-2 rounded hover:bg-blue-100 cursor-pointer"
            >
              {item.name}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, Parent</h1>
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
            <div className="flex items-center space-x-2 cursor-pointer">
              <UserCircleIcon className="w-8 h-8 text-gray-600" />
              <span className="text-gray-700">Parent</span>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Current Term</p>
            <p className="text-lg font-semibold">Fall 2024</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Overall GPA</p>
            <p className="text-lg font-semibold text-green-600">3.7</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Attendance Rate</p>
            <p className="text-lg font-semibold text-purple-600">96%</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">New Updates</p>
              <p className="text-lg font-semibold">2</p>
            </div>
            <BellIcon className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        {/* Performance Trends & Recent Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Performance Trends</h2>
            <p className="text-sm text-gray-500 mb-2">Overall grade progression</p>
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
              {/* Placeholder for chart */}
              Chart Placeholder
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Recent Updates</h2>
            <ul className="space-y-3">
              {updates.map((update, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">{update.title}</p>
                    <p className="text-xs text-gray-400">{update.date} • {update.type}</p>
                  </div>
                  {update.new && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;

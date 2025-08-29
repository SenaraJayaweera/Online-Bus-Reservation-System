import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaSearch,
  FaDownload,
  FaUser,
  FaEnvelope,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.success) {
            setUsers(data.users);
          } else {
            console.error("Failed to fetch users:", data.message);
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError, "Response text:", text);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDateSearch = () => {
    const filtered = users.filter((user) => {
      const userDate = new Date(user.createdAt);
      const isAfterStart = startDate ? userDate >= new Date(startDate) : true;
      const isBeforeEnd = endDate ? userDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999)) : true;
      return isAfterStart && isBeforeEnd;
    });
    setFilteredUsers(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const logoUrl = "/buisness-logo.png";
    const logoWidth = 30;
    const logoHeight = 20;
    const logoX = 14;
    const logoY = 10;

    doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
    const textX = logoX + logoWidth + 10;
    const textY = logoY + 5;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MALSHAN MOTORS", textX, textY);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("User Details Report", textX, textY + 8);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, textX, textY + 16);

    const tableStartY = logoY + logoHeight + 20;
    const tableData = (filteredUsers.length > 0 ? filteredUsers : users).map((user) => [
      user.name,
      user.email,
      user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
      user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [["Name", "Email", "Last Login", "Register Date"]],
      body: tableData,
    });

    doc.save("User_Details.pdf");
  };

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  const dailyUsers = users.filter((u) => new Date(u.createdAt) >= startOfToday).length;
  const weeklyUsers = users.filter((u) => new Date(u.createdAt) >= oneWeekAgo).length;
  const monthlyUsers = users.filter((u) => new Date(u.createdAt) >= oneMonthAgo).length;

  const userGrowthData = () => {
    const data = {
      labels: [],
      datasets: [{
        label: "User Growth",
        data: [],
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        fill: true,
        tension: 0.4,
      }],
    };

    const userMap = {};
    users.forEach((user) => {
      const date = new Date(user.createdAt);
      const month = `${date.getMonth() + 1}-${date.getFullYear()}`;
      if (!userMap[month]) userMap[month] = 0;
      userMap[month]++;
    });

    for (const [key, value] of Object.entries(userMap)) {
      data.labels.push(key);
      data.datasets[0].data.push(value);
    }

    return data;
  };

  const userActivityData = () => {
    const data = {
      labels: ["Today", "This Week", "This Month"],
      datasets: [{
        label: "User Activity",
        data: [
          users.filter((u) => new Date(u.lastLogin).toDateString() === new Date().toDateString()).length,
          users.filter((u) => new Date(u.lastLogin) >= oneWeekAgo).length,
          users.filter((u) => new Date(u.lastLogin) >= oneMonthAgo).length,
        ],
        backgroundColor: "#34D399",
      }],
    };

    return data;
  };

  const newVsReturningData = () => {
  const result = {
    labels: [],
    datasets: [
      {
        label: "New Users",
        data: [],
        backgroundColor: "#34D399",
      },
      {
        label: "Returning Users",
        data: [],
        backgroundColor: "#FBBF24",
      },
    ],
  };

  const buckets = {};
  users.forEach((user) => {
    const createdAt = new Date(user.createdAt);
    const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (!buckets[key]) buckets[key] = { newUsers: 0, returningUsers: 0 };
    
    if (user.lastLogin && new Date(user.lastLogin) > createdAt) {
      buckets[key].returningUsers += 1;
    } else {
      buckets[key].newUsers += 1;
    }
  });

  for (const [key, value] of Object.entries(buckets)) {
    result.labels.push(key);
    result.datasets[0].data.push(value.newUsers);
    result.datasets[1].data.push(value.returningUsers);
  }

  return result;
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Admin Dashboard
        </h2>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6 w-full md:w-1/2 mx-auto">
          <FaSearch className="text-gray-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email"
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-1/4 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
          />
          <span className="text-white">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-1/4 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
          />
          <button
            onClick={handleDateSearch}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            Filter by Date
          </button>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white text-lg font-semibold mb-6 text-center">
          <div className="bg-gray-800 p-4 rounded-lg shadow">Total Users: <span className="text-green-400">{users.length}</span></div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">Daily: <span className="text-blue-400">{dailyUsers}</span></div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">Weekly: <span className="text-yellow-400">{weeklyUsers}</span></div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">Monthly: <span className="text-purple-400">{monthlyUsers}</span></div>
        </div>

        {/* Table & Charts */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Table */}
          <div className="w-full md:w-1/2 rounded-lg shadow-md p-6 overflow-auto">
            <table className="w-full table-auto border-collapse border border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-800 text-white text-lg">
                  <th className="border border-gray-600 p-2"><FaUser className="inline mr-1" /> Name</th>
                  <th className="border border-gray-600 p-2"><FaEnvelope className="inline mr-1" /> Email</th>
                  <th className="border border-gray-600 p-2"><FaClock className="inline mr-1" /> Last Login</th>
                  <th className="border border-gray-600 p-2"><FaCalendarAlt className="inline mr-1" /> Register Date</th>
                </tr>
              </thead>
              <tbody>
                {(filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
                  <tr key={user._id} className="text-center bg-gray-700 text-gray-300 hover:bg-gray-600 transition">
                    <td className="border border-gray-600 p-2">{user.name}</td>
                    <td className="border border-gray-600 p-2">{user.email}</td>
                    <td className="border border-gray-600 p-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</td>
                    <td className="border border-gray-600 p-2">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-80 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">User Growth</h3>
              <Line data={userGrowthData()} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "white" }}} }} />
            </div>

            <div className="h-80 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">User Activity</h3>
              <Bar data={userActivityData()} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "white" }}} }} />
            </div>

            <div className="h-96 bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">New vs Returning Users</h3>
              <Bar data={newVsReturningData()} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255,255,255,0.1)" },
                  },
                  y: {
                    stacked: true,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255,255,255,0.1)" },
                  },
                },
              }} />
            </div>
          </div>
        </div>

        <div className="flex justify-center my-6">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FaDownload /> Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;

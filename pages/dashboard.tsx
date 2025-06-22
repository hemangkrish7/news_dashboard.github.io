// FILE: pages/dashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setArticles } from "../redux/slices/newsSlice";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { logoutUser } from "../redux/slices/authSlice";
import { motion } from "framer-motion";

export default function Dashboard() {
  const dispatch = useDispatch();
  const articles = useSelector((state: RootState) => state.news.articles);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [type, setType] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=e19186b3377144f58fa8183a86e22500`
        );
        dispatch(setArticles(res.data.articles));
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };

    fetchNews();
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const guessCategory = (text: string): string => {
    const lower = text.toLowerCase();
    if (/(tech|ai|software|gadget|iphone|android)/.test(lower)) return "Technology";
    if (/(politic|election|government|president|minister)/.test(lower)) return "Politics";
    if (/(sport|match|tournament|cricket|football|nba)/.test(lower)) return "Sports";
    if (/(business|startup|market|stock|economy|trade)/.test(lower)) return "Business";
    return "General";
  };

  const filteredArticles = articles.filter((article) => {
    const authorMatch =
      article.author?.toLowerCase().includes(search.toLowerCase()) ||
      article.title?.toLowerCase().includes(search.toLowerCase());

    const publishedAt = new Date(article.publishedAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const dateMatch = (!from || publishedAt >= from) && (!to || publishedAt <= to);

    const cat = guessCategory(`${article.title} ${article.description || ""}`);
    const typeMatch = !type || cat === type;

    return authorMatch && dateMatch && typeMatch;
  });
  

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative p-6 min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full animate-pulse bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        </div>

        <nav className="relative z-10 flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
            >
              Dashboard
            </button>
            {user?.isAdmin && (
              <>
                <button
                  onClick={() => router.push("/admin/payout")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Payouts
                </button>
                <button
                  onClick={() => router.push("/admin/analytics")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Analytics
                </button>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem("theme", newMode ? "dark" : "light");
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="relative z-10 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold">📢 Welcome back, {user?.name || "Guest"}!</h2>
          <p className="text-sm opacity-80">Here's the latest top headlines curated for you.</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by author or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full text-black"
          />
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-3 py-2 w-full text-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-3 py-2 w-full text-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded px-3 py-2 w-full text-black"
            >
              <option value="">All Types</option>
              <option value="Technology">Technology</option>
              <option value="Politics">Politics</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="relative z-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-2xl"
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{article.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By {article.author || "Unknown"} • {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block hover:underline"
              >
                Read more →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FILE: pages/admin/analytics.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setArticles } from "../../redux/slices/newsSlice";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import axios from "axios";

interface Article {
  title: string;
  author: string;
  publishedAt: string;
}

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const articles = useSelector((state: RootState) => state.news.articles);
  const [byAuthor, setByAuthor] = useState<{ name: string; count: number }[]>([]);
  const [byCategory, setByCategory] = useState<{ name: string; value: number }[]>([]);

 const guessCategory = (text: string): string => {
  const lower = text.toLowerCase();

  if (/(tech|ai|software|gadget|iphone|android|app|robot|programming|code|cloud|data)/.test(lower))
    return "Technology";
  if (/(politic|election|government|president|minister|policy|congress|senate|bjp|modi|rahul)/.test(lower))
    return "Politics";
  if (/(sport|match|tournament|cricket|football|nba|team|score|goal|fifa|ipl|bcci|player)/.test(lower))
    return "Sports";
  if (/(business|startup|market|stock|economy|trade|funding|investment|bank|finance|shares)/.test(lower))
    return "Business";

  return "General";
};


  useEffect(() => {
    const fetchAndAnalyze = async () => {
      let sourceArticles = articles;

      if (sourceArticles.length === 0) {
        try {
          const res = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=e19186b3377144f58fa8183a86e22500`
          );
          sourceArticles = res.data.articles;
          dispatch(setArticles(sourceArticles));
        } catch (err) {
          console.error("Failed to fetch articles", err);
          return;
        }
      }

      const authorMap: { [author: string]: number } = {};
      const categoryMap: { [category: string]: number } = {};

      sourceArticles.forEach((a) => {
        const author = a.author || "Unknown";
        authorMap[author] = (authorMap[author] || 0) + 1;

        const cat = guessCategory(a.title);
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      setByAuthor(Object.entries(authorMap).map(([name, count]) => ({ name, count })));
      setByCategory(Object.entries(categoryMap).map(([name, value]) => ({ name, value })));
    };

    fetchAndAnalyze();
  }, [articles, dispatch]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF5"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">News Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Articles by Author</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byAuthor}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2">Articles by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {byCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

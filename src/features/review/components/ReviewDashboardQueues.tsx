import { useState, useEffect } from "react";
import { Clock3, Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";
import { MOCK_CONCEPTS } from "../data/mockConcepts";

export function ReviewDashboardQueues() {
  const navigate = useNavigate();

  // Set a mock deadline (e.g., 2 days, 13 hours, 36 minutes from now)
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 13, minutes: 36 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"date-desc" | "date-asc" | "title-asc">("date-desc");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev;
        
        if (minutes > 0) {
          minutes--;
        } else {
          minutes = 59;
          if (hours > 0) {
            hours--;
          } else {
            hours = 23;
            if (days > 0) {
              days--;
            } else {
              clearInterval(timer);
              return { days: 0, hours: 0, minutes: 0 };
            }
          }
        }
        return { days, hours, minutes };
      });
    }, 60000); // Update every minute for UI efficiency

    return () => clearInterval(timer);
  }, []);

  let filteredConcepts = MOCK_CONCEPTS;

  // 1. Apply Status Filter
  if (filterStatus !== "All") {
    filteredConcepts = filteredConcepts.filter(c => c.status === filterStatus);
  }

  // 2. Apply Text Search Filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredConcepts = filteredConcepts.filter((concept) => (
      concept.title.toLowerCase().includes(query) ||
      concept.submitter.toLowerCase().includes(query) ||
      concept.category.toLowerCase().includes(query) ||
      concept.status.toLowerCase().includes(query)
    ));
  }

  // 3. Apply Sorting
  filteredConcepts = [...filteredConcepts].sort((a, b) => {
    if (sortOrder === "title-asc") {
      return a.title.localeCompare(b.title);
    } 
    // Very simple date string compare fallback, ideally use full Date object parsing
    if (sortOrder === "date-asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Banner */}
      <div className="bg-white rounded-[16px] border border-slate-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex items-center justify-between p-7 relative">
        {/* Left accent border */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-[60%] bg-[#FFC107] rounded-r-md" />
        
        <div className="flex items-center gap-4 pl-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Clock3 className="text-slate-500 w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-lg font-semibold text-slate-800 leading-tight mb-1">Begin Your Review</h2>
            <p className="text-sm text-slate-600">Submit your evaluations before the deadline to ensure your feedback is considered.</p>
          </div>
        </div>

        <div className="flex items-center gap-5 mr-6">
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-3xl font-bold text-slate-800 leading-none mb-1">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">days</span>
          </div>
          <span className="text-2xl font-light text-slate-300 pb-4">:</span>
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-3xl font-bold text-slate-800 leading-none mb-1">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">hours</span>
          </div>
          <span className="text-2xl font-light text-slate-300 pb-4">:</span>
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-3xl font-bold text-slate-800 leading-none mb-1">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">minutes</span>
          </div>
        </div>
      </div>

      {/* Concepts Heading */}
      <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Concepts ({MOCK_CONCEPTS.length})</h1>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden pb-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="relative w-80 flex items-center">
            <Input 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-300 shadow-none h-10 w-full"
            />
            <Search className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <div className="h-6 w-px bg-slate-200 mr-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("All")}>
                  {filterStatus === "All" && "✓ "}All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Yet to Review")}>
                  {filterStatus === "Yet to Review" && "✓ "}Yet to Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Reviewed")}>
                  {filterStatus === "Reviewed" && "✓ "}Reviewed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowUpDown className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("date-desc")}>
                  Sort by Date (Newest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("date-asc")}>
                  Sort by Date (Oldest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("title-asc")}>
                  Sort by Title (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8FAFC] text-slate-500 font-medium border-y border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium w-[35%]">Title</th>
                <th className="px-6 py-4 font-medium w-[15%]">Submitter</th>
                <th className="px-6 py-4 font-medium w-[20%]">Category</th>
                <th className="px-6 py-4 font-medium w-[15%]">Date</th>
                <th className="px-6 py-4 font-medium w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredConcepts.map((concept) => (
                <tr 
                  key={concept.id} 
                  onClick={() => navigate(`/reviewer/review/${concept.id}`)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5 font-semibold text-slate-800">{concept.title}</td>
                  <td className="px-6 py-5 text-slate-500">{concept.submitter}</td>
                  <td className="px-6 py-5 text-slate-500">{concept.category}</td>
                  <td className="px-6 py-5 text-slate-500">{concept.date}</td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white">
                      <div className={`w-1.5 h-1.5 rounded-full ${concept.status === 'Yet to Review' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                      <span className="text-xs font-medium text-slate-700">{concept.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

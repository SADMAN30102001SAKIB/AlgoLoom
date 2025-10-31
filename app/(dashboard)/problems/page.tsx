"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  acceptanceRate: number;
  tags: string[];
  isPremium: boolean;
  userStatus?: "SOLVED" | "ATTEMPTED" | null;
  hintsUsed?: boolean;
}

export default function ProblemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [filter, setFilter] = useState({
    difficulty: "",
    tags: "",
    status: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.difficulty) params.append("difficulty", filter.difficulty);
      if (filter.tags) params.append("tags", filter.tags);
      if (filter.status) params.append("status", filter.status);
      params.append("page", currentPage.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());

      const response = await fetch(`/api/problems?${params}`);
      const data = await response.json();

      if (data.success) {
        setProblems(data.problems);
        setTotalProblems(data.pagination.totalCount);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]); // Re-fetch when page changes

  // Pagination calculations
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProblems);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter.difficulty, filter.tags, filter.status]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "HARD":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusIcon = (status?: string | null) => {
    if (status === "SOLVED") {
      return <span className="text-green-400">✓</span>;
    }
    if (status === "ATTEMPTED") {
      return <span className="text-yellow-400">○</span>;
    }
    return null;
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AlgoLoom
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">
              Welcome, {session?.user?.email}
            </span>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition border border-red-500/20">
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Problem Set</h1>
          <p className="text-slate-400">Choose a problem to start solving</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={filter.difficulty}
                onChange={e =>
                  setFilter({ ...filter, difficulty: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filter.status}
                onChange={e => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="">All Status</option>
                <option value="SOLVED">Solved</option>
                <option value="ATTEMPTED">Attempted</option>
                <option value="TODO">Todo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="e.g., array, string"
                value={filter.tags}
                onChange={e => setFilter({ ...filter, tags: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              Loading problems...
            </div>
          ) : problems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 mb-4">No problems found</p>
              <p className="text-sm text-slate-500">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Acceptance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {problems.map(problem => (
                    <tr
                      key={problem.id}
                      className="hover:bg-slate-700/30 transition cursor-pointer"
                      onClick={() => router.push(`/problems/${problem.slug}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-2xl">
                        {getStatusIcon(problem.userStatus)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium hover:text-purple-400 transition">
                            {problem.title}
                          </span>
                          {problem.isPremium && (
                            <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20">
                              Premium
                            </span>
                          )}
                          {problem.hintsUsed && (
                            <span
                              className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20"
                              title="You used hints on this problem">
                              💡 Hint Used
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                            problem.difficulty,
                          )}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {problem.acceptanceRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{problem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to {endIndex} of {totalProblems} problems
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Previous
              </button>

              <div className="flex items-center gap-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 transition">
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="text-slate-500 px-2">...</span>
                    )}
                  </>
                )}

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return (
                      page === currentPage ||
                      page === currentPage - 1 ||
                      page === currentPage + 1 ||
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    );
                  })
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg border transition ${
                        page === currentPage
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50"
                      }`}>
                      {page}
                    </button>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="text-slate-500 px-2">...</span>
                    )}
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 transition">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

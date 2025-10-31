"use client";

import { useState } from "react";

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  _count: {
    testCases: number;
    submissions: number;
  };
}

export default function ProblemsListClient({
  initialProblems,
}: {
  initialProblems: Problem[];
}) {
  const [problems, setProblems] = useState(initialProblems);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/problems/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProblems(problems.filter(p => p.id !== id));
      } else {
        alert("Failed to delete problem");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {problems.map(problem => (
        <div
          key={problem.id}
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <a
                  href={`/admin/problems/${problem.slug}`}
                  className="text-xl font-semibold text-white hover:text-blue-400">
                  {problem.title}
                </a>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    problem.difficulty === "EASY"
                      ? "bg-green-500/20 text-green-400"
                      : problem.difficulty === "MEDIUM"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}>
                  {problem.difficulty}
                </span>
                {!problem.publishedAt && (
                  <span className="text-xs px-2 py-1 rounded bg-slate-500/20 text-slate-400">
                    Draft
                  </span>
                )}
                {problem.isPremium && (
                  <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>Slug: {problem.slug}</span>
                <span>•</span>
                <span>{problem._count.testCases} test cases</span>
                <span>•</span>
                <span>{problem._count.submissions} submissions</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span>
                  Created: {new Date(problem.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>
                  Updated: {new Date(problem.updatedAt).toLocaleDateString()}
                </span>
                {problem.publishedAt && (
                  <>
                    <span>•</span>
                    <span>
                      Published:{" "}
                      {new Date(problem.publishedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/problems/${problem.slug}`}
                target="_blank"
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white border border-slate-600 rounded hover:border-slate-500 transition">
                View
              </a>
              <a
                href={`/admin/problems/${problem.slug}`}
                className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded hover:border-blue-500/50 transition">
                Edit
              </a>
              <button
                onClick={() => handleDelete(problem.id, problem.title)}
                disabled={deleting === problem.id}
                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 rounded hover:border-red-500/50 transition disabled:opacity-50">
                {deleting === problem.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}

      {problems.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg mb-2">No problems yet</p>
          <a
            href="/admin/problems/new"
            className="text-blue-400 hover:text-blue-300">
            Create your first problem
          </a>
        </div>
      )}
    </div>
  );
}

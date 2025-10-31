import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Trophy, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Logo/Title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Code2 className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-white">AlgoLoom</h1>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Master Algorithms
            <br />
            <span className="text-primary">with AI-Powered Hints</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Level up your coding skills with gamified problem-solving. Get
            intelligent hints when stuck, track your progress, and compete on
            the leaderboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/problems">
              <Button size="lg" className="text-lg gap-2">
                Start Solving
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/api/auth/signin">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {/* Feature 1: AI Hints */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              AI-Powered Hints
            </h3>
            <p className="text-gray-400">
              Get progressive, non-spoiler hints from Google Gemini AI when
              you&apos;re stuck. Three levels of hints to guide you without
              giving away the solution.
            </p>
          </div>

          {/* Feature 2: Gamification */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Level Up & Earn XP
            </h3>
            <p className="text-gray-400">
              Earn XP for every problem solved. Level up, unlock achievements,
              maintain streaks, and watch your skills grow with our
              comprehensive progression system.
            </p>
          </div>

          {/* Feature 3: Compete */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Global Leaderboard
            </h3>
            <p className="text-gray-400">
              Compete with developers worldwide. Track your rank, compare stats,
              and climb the leaderboard by solving problems and earning XP.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-gray-800/30 backdrop-blur border border-gray-700 rounded-lg p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-400">Problems</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-gray-400">Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">FREE</div>
              <div className="text-gray-400">Forever</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            How AlgoLoom Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                1
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Choose a Problem
              </h4>
              <p className="text-gray-400 text-sm">
                Browse 500+ problems by difficulty, tags, or company
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                2
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Code Your Solution
              </h4>
              <p className="text-gray-400 text-sm">
                Use our Monaco editor with Python, C++, Java, or JavaScript
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                3
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Get AI Hints
              </h4>
              <p className="text-gray-400 text-sm">
                Stuck? Request progressive hints from Gemini AI
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                4
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Earn XP & Rank Up
              </h4>
              <p className="text-gray-400 text-sm">
                Submit, get instant feedback, and earn XP to level up
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-400 mb-8">
            Join thousands of developers mastering algorithms on AlgoLoom
          </p>
          <Link href="/problems">
            <Button size="lg" className="text-lg gap-2">
              Explore Problems
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <div>© 2024 AlgoLoom. All rights reserved.</div>
            <div className="flex gap-6">
              <Link
                href="/about"
                className="hover:text-primary transition-colors">
                About
              </Link>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

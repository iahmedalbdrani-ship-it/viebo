"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiMagnifyingGlass, HiFire } from "react-icons/hi2";

const trendingHashtags = [
  { tag: "photography", postCount: "12.5K" },
  { tag: "webdev", postCount: "8.3K" },
  { tag: "design", postCount: "15.2K" },
  { tag: "music", postCount: "20.1K" },
  { tag: "travel", postCount: "18.7K" },
  { tag: "fitness", postCount: "9.8K" },
];

const categories = [
  { name: "Entertainment", emoji: "🎬", color: "from-purple-500 to-pink-500" },
  { name: "Music", emoji: "🎵", color: "from-blue-500 to-cyan-500" },
  { name: "Sports", emoji: "⚽", color: "from-green-500 to-emerald-500" },
  { name: "Education", emoji: "📚", color: "from-yellow-500 to-orange-500" },
  { name: "Tech", emoji: "💻", color: "from-indigo-500 to-violet-500" },
  { name: "Food", emoji: "🍕", color: "from-red-500 to-rose-500" },
  { name: "Art", emoji: "🎨", color: "from-pink-500 to-fuchsia-500" },
  { name: "Gaming", emoji: "🎮", color: "from-teal-500 to-cyan-500" },
];

const suggestedCreators = [
  { name: "Alex Creative", username: "alexcreative", followers: "125K" },
  { name: "Digital Nomad", username: "digitalnomad", followers: "89K" },
  { name: "Code Master", username: "codemaster", followers: "201K" },
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <h1 className="text-xl font-bold text-text-primary mb-4">Discover</h1>
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, hashtags, locations..."
            className="w-full bg-surface rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Trending */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <HiFire className="w-5 h-5 text-accent" />
            <h2 className="text-text-primary font-semibold">Trending</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((item) => (
              <motion.button
                key={item.tag}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-surface hover:bg-surface-light transition-colors"
              >
                <span className="text-primary text-sm font-medium">
                  #{item.tag}
                </span>
                <span className="text-text-secondary text-xs ml-2">
                  {item.postCount}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-text-primary font-semibold mb-3">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.name}
                whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 text-left transition-opacity hover:opacity-90`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <p className="text-white font-semibold text-sm mt-2">
                  {cat.name}
                </p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Suggested Creators */}
        <section>
          <h2 className="text-text-primary font-semibold mb-3">
            Suggested Creators
          </h2>
          <div className="space-y-3">
            {suggestedCreators.map((creator) => (
              <div
                key={creator.username}
                className="flex items-center gap-3 p-3 bg-surface rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-text-primary font-bold">
                  {creator.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-semibold">
                    {creator.name}
                  </p>
                  <p className="text-text-secondary text-xs">
                    @{creator.username} &middot; {creator.followers} followers
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-medium"
                >
                  Follow
                </motion.button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiCamera,
  HiHeart,
  HiChatBubbleLeftRight,
  HiUser,
  HiMagnifyingGlass,
  HiSparkles,
  HiCog6Tooth,
} from "react-icons/hi2";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isPrimary?: boolean;
}

const navItems: NavItem[] = [
  { icon: HiHome, label: "Home", href: "/" },
  { icon: HiMagnifyingGlass, label: "Search", href: "/discover" },
  { icon: HiCamera, label: "Camera", href: "/camera", isPrimary: true },
  { icon: HiHeart, label: "Likes", href: "/notifications" },
  { icon: HiChatBubbleLeftRight, label: "Messages", href: "/messages" },
  { icon: HiUser, label: "Profile", href: "/profile" },
  { icon: HiSparkles, label: "Discover", href: "/discover" },
  { icon: HiCog6Tooth, label: "Settings", href: "/settings" },
];

export default function FloatingIconBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const primaryItem = navItems.find((item) => item.isPrimary)!;
  const secondaryItems = navItems.filter((item) => !item.isPrimary);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass rounded-2xl p-3 shadow-lg shadow-primary/30"
          >
            <div className="flex flex-col gap-2">
              {secondaryItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsExpanded(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "text-text-secondary hover:bg-white/10 hover:text-text-primary"
                        }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-primary" : ""
                        }`}
                      />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Camera Button */}
      <div className="flex items-center gap-3">
        {/* Menu toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary/20
            ${isExpanded ? "rotate-45 bg-primary/30" : ""}`}
        >
          <svg
            className="w-5 h-5 text-text-primary transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>

        {/* Camera CTA */}
        <Link href={primaryItem.href}>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/40 cursor-pointer"
          >
            <HiCamera className="w-7 h-7 text-white" />
          </motion.div>
        </Link>
      </div>

      {/* Bottom nav bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden glass-dark border-t border-white/10">
        <div className="flex items-center justify-around py-2 px-4">
          {[navItems[0], navItems[1], navItems[2], navItems[4], navItems[5]].map(
            (item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                    item.isPrimary
                      ? "bg-gradient-to-br from-primary to-accent rounded-full p-3 -mt-5 shadow-lg shadow-primary/40"
                      : isActive
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${item.isPrimary ? "text-white" : ""}`}
                  />
                  {!item.isPrimary && (
                    <span className="text-[10px]">{item.label}</span>
                  )}
                </Link>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

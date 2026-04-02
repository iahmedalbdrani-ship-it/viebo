"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiUser,
  HiBell,
  HiLockClosed,
  HiPaintBrush,
  HiShieldCheck,
  HiInformationCircle,
  HiArrowRightOnRectangle,
  HiChevronRight,
} from "react-icons/hi2";

interface SettingItem {
  icon: React.ElementType;
  label: string;
  description: string;
  action?: () => void;
  toggle?: boolean;
  value?: boolean;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          icon: HiUser,
          label: "Edit Profile",
          description: "Update your profile information",
        },
        {
          icon: HiLockClosed,
          label: "Privacy",
          description: "Control your account privacy",
          toggle: true,
          value: privateAccount,
          action: () => setPrivateAccount(!privateAccount),
        },
        {
          icon: HiShieldCheck,
          label: "Security",
          description: "Password and authentication",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: HiBell,
          label: "Notifications",
          description: "Manage notification settings",
          toggle: true,
          value: notifications,
          action: () => setNotifications(!notifications),
        },
        {
          icon: HiPaintBrush,
          label: "Appearance",
          description: "Theme and display settings",
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: HiInformationCircle,
          label: "About Vibeo",
          description: "Version 1.0.0",
        },
      ],
    },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
      </header>

      <div className="p-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 px-2">
              {section.title}
            </h2>
            <div className="bg-surface rounded-2xl overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    whileTap={{ scale: 0.99 }}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-surface-light transition-colors text-left ${
                      index > 0 ? "border-t border-white/5" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary text-sm font-medium">
                        {item.label}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {item.description}
                      </p>
                    </div>
                    {item.toggle ? (
                      <div
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          item.value ? "bg-primary" : "bg-text-secondary/30"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            item.value ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    ) : (
                      <HiChevronRight className="w-5 h-5 text-text-secondary" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 p-4 bg-accent/10 rounded-2xl text-accent font-medium text-sm hover:bg-accent/20 transition-colors"
        >
          <HiArrowRightOnRectangle className="w-5 h-5" />
          Log Out
        </motion.button>
      </div>
    </div>
  );
}

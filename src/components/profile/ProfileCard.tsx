"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { User } from "@/types";

interface ProfileCardProps {
  user: User;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEditProfile?: () => void;
}

export default function ProfileCard({
  user,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onMessage,
  onEditProfile,
}: ProfileCardProps) {
  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/30 to-accent/30 rounded-b-3xl overflow-hidden">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-12">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] mb-3">
          <div className="w-full h-full rounded-full bg-dark overflow-hidden">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.displayName}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-primary text-2xl font-bold bg-surface">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Name & Bio */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-text-primary text-xl font-bold">
              {user.displayName}
            </h1>
            {user.isVerified && (
              <span className="text-secondary text-lg">&#10003;</span>
            )}
          </div>
          <p className="text-text-secondary text-sm">@{user.username}</p>
          {user.bio && (
            <p className="text-text-primary text-sm mt-2">{user.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <p className="text-text-primary font-bold">0</p>
            <p className="text-text-secondary text-xs">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-text-primary font-bold">
              {user.followers.length.toLocaleString()}
            </p>
            <p className="text-text-secondary text-xs">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-text-primary font-bold">
              {user.following.length.toLocaleString()}
            </p>
            <p className="text-text-secondary text-xs">Following</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isOwnProfile ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onEditProfile}
              className="flex-1 py-2.5 rounded-xl bg-surface border border-white/10 text-text-primary font-medium text-sm hover:bg-surface-light transition-colors"
            >
              Edit Profile
            </motion.button>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onFollow}
                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isFollowing
                    ? "bg-surface border border-white/10 text-text-primary hover:bg-surface-light"
                    : "bg-primary text-white hover:bg-primary/80"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onMessage}
                className="py-2.5 px-6 rounded-xl bg-surface border border-white/10 text-text-primary font-medium text-sm hover:bg-surface-light transition-colors"
              >
                Message
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

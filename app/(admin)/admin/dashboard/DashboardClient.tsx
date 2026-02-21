"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminUploader } from "@/components/AdminUploader";
import Image from "next/image";

interface Group {
  id: string;
  name: string;
  slug: string;
  defaultView: string;
  createdAt: string;
  _count: { photos: number };
}

interface RecentPhoto {
  id: string;
  thumbnailUrl: string;
  title: string | null;
  createdAt: string;
  group: { name: string } | null;
}

interface DashboardClientProps {
  session: { userId: string; email: string };
  stats: { photoCount: number; groupCount: number };
  groups: Group[];
  recentPhotos: RecentPhoto[];
}

export function DashboardClient({
  session,
  stats,
  groups,
  recentPhotos,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upload" | "groups" | "photos">(
    "upload"
  );
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupView, setNewGroupView] = useState("grid");
  const [groupError, setGroupError] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError("");
    setGroupLoading(true);

    try {
      const res = await fetch("/api/admin/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName, defaultView: newGroupView }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGroupError(data.error ?? "Failed to create group");
        return;
      }
      setNewGroupName("");
      setShowNewGroup(false);
      router.refresh();
    } catch {
      setGroupError("Connection error");
    } finally {
      setGroupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Admin header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/30 tracking-widest uppercase">
            Admin
          </p>
          <h1 className="text-lg font-light text-white/90">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30 hidden sm:block">
            {session.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-white/30 hover:text-white transition-colors tracking-wider uppercase active:scale-95"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Photos", value: stats.photoCount },
            { label: "Groups", value: stats.groupCount },
            { label: "Storage", value: "Local" },
            { label: "Status", value: "Active" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <p className="text-xs text-white/30 tracking-widest uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-light text-white/80">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
          {(["upload", "groups", "photos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm transition-colors capitalize ${
                activeTab === tab
                  ? "bg-white text-black font-medium"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <label className="block text-xs text-white/40 tracking-wider uppercase mb-2">
                  Upload to group (optional)
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                >
                  <option value="">— No group —</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <AdminUploader
                groupId={selectedGroup || undefined}
                onUploadComplete={() => router.refresh()}
              />
            </motion.div>
          )}

          {activeTab === "groups" && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div>
                    <p className="text-sm text-white/80">{g.name}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {g._count.photos} photos · {g.defaultView} view ·{" "}
                      <span className="font-mono">/work/{g.slug}</span>
                    </p>
                  </div>
                </div>
              ))}

              {/* New group form */}
              <AnimatePresence>
                {showNewGroup && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateGroup}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3"
                  >
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Group name"
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
                      required
                    />
                    <select
                      value={newGroupView}
                      onChange={(e) => setNewGroupView(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="grid">Grid view</option>
                      <option value="carousel">Filmstrip view</option>
                      <option value="wall">Wall view</option>
                    </select>
                    {groupError && (
                      <p className="text-red-400 text-xs">{groupError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={groupLoading}
                        className="px-4 py-2 bg-white text-black rounded text-sm font-medium hover:bg-white/90 disabled:opacity-50 active:scale-95 flex items-center gap-2"
                      >
                        {groupLoading && (
                          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewGroup(false)}
                        className="px-4 py-2 text-white/40 hover:text-white text-sm active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {!showNewGroup && (
                <button
                  onClick={() => setShowNewGroup(true)}
                  className="w-full border border-dashed border-white/20 rounded-lg py-4 text-sm text-white/30 hover:text-white/60 hover:border-white/40 transition-colors active:scale-[0.99]"
                >
                  + New group
                </button>
              )}
            </motion.div>
          )}

          {activeTab === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {recentPhotos.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                  <p className="text-sm">No photos uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {recentPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square bg-white/5 rounded overflow-hidden group"
                    >
                      <Image
                        src={photo.thumbnailUrl}
                        alt={photo.title ?? "Photo"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      {photo.group && (
                        <div className="absolute bottom-0 left-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white/70 truncate">
                            {photo.group.name}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

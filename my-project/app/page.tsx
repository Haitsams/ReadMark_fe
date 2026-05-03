"use client";

import { useState, useEffect, FormEvent } from "react";

interface Bookmark {
  _id: string;
  title: string;
  url: string;
  category: "Artikel" | "Buku" | "Video";
}

interface BookmarkInput {
  title: string;
  url: string;
  category: Bookmark["category"];
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/bookmarks`;

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BookmarkInput>({
    title: "",
    url: "",
    category: "Artikel",
  });

  // GET — ambil semua bookmark saat pertama kali render
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Gagal memuat bookmark");
        setBookmarks(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // POST — kirim bookmark baru ke backend
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal menambah bookmark");
      const newBookmark: Bookmark = await res.json();
      setBookmarks((prev) => [newBookmark, ...prev]);
      setForm({ title: "", url: "", category: "Artikel" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // DELETE — hapus berdasarkan _id
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  // Style per kategori — warna neon ala Gen Z
  const categoryStyle = (category: Bookmark["category"]) => {
    switch (category) {
      case "Artikel":
        return "bg-cyan-300 text-black border-black";
      case "Buku":
        return "bg-lime-300 text-black border-black";
      case "Video":
        return "bg-pink-400 text-black border-black";
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8E7] text-black relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-40" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-cyan-300 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-lime-300 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-block bg-black text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-4 rotate-[-2deg]">
            ✦ YOUR READING ERA ✦
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            Read<span className="text-pink-500">Mark</span>
          </h1>
          <p className="mt-3 text-lg text-black/65 font-medium">
            “Books are a uniquely portable magic.” <br />
            save the bookmarks. live the vibe. no cap!!
          </p>
        </header>

        <section className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black mb-5 flex items-center gap-2">
            <span className="bg-pink-400 px-3 py-1 rounded-lg border-2 border-black">
              + drop a link
            </span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="judulnya apa bestie?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="border-2 border-black rounded-xl px-4 py-3 font-medium placeholder:text-black/40 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all"
            />
            <input
              type="url"
              placeholder="https://.com"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
              className="border-2 border-black rounded-xl px-4 py-3 font-medium placeholder:text-black/40 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all"
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as Bookmark["category"],
                })
              }
              className="border-2 border-black rounded-xl px-4 py-3 font-medium bg-white focus:outline-none focus:ring-4 focus:ring-lime-300 transition-all"
            >
              <option value="Artikel"> Artikel</option>
              <option value="Buku"> Buku</option>
              <option value="Video"> Video</option>
            </select>
            <button
              type="submit"
              className="bg-black text-white font-black uppercase tracking-wider rounded-xl px-4 py-3 border-2 border-black hover:bg-pink-500 hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              save it !!
            </button>
          </form>
        </section>

        {/* List */}
        <section>
          <h2 className="text-2xl font-black mb-5 flex items-center gap-3">
            <span>your stash</span>
            <span className="bg-black text-white text-sm px-3 py-1 rounded-full">
              {bookmarks.length}
            </span>
          </h2>

          {error && (
            <div className="bg-red-300 border-2 border-black rounded-xl p-4 mb-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <p className="font-bold text-lg">loading the vibes... ⏳</p>
          ) : bookmarks.length === 0 ? (
            <div className="bg-white border-4 border-dashed border-black rounded-3xl p-12 text-center">
              <p className="text-2xl font-black mb-2">it's empty here ;(</p>
              <p className="text-black/60">drop your first link di atas!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookmarks.map((b, i) => (
                <article
                  key={b._id}
                  className={`bg-white border-4 border-black rounded-3xl p-5 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all ${
                    i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                  } hover:rotate-0`}
                >
                  <div>
                    <span
                      className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 mb-3 ${categoryStyle(
                        b.category
                      )}`}
                    >
                      {b.category}
                    </span>
                    <h3 className="text-xl font-black mb-2 line-clamp-2 leading-tight">
                      {b.title}
                    </h3>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-black/60 hover:text-pink-500 break-all underline decoration-wavy decoration-pink-400"
                    >
                      {b.url} ↗
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="mt-4 self-start bg-red-400 border-2 border-black text-black text-sm font-black uppercase px-3 py-1 rounded-full hover:bg-red-500 hover:scale-105 transition-all"
                  >
                    delete fr 🗑
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 text-black/50 font-bold text-sm">
          made with 💖 + ☕ — stay curious bestie
        </footer>
      </div>
    </main>
  );
}

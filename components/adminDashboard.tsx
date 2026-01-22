"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [selected, setSelected] = useState("Post Work");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [github, setGithub] = useState(""); // for Post Work
  const [message, setMessage] = useState("");

  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [editProject, setEditProject] = useState<any | null>(null);

  const [aboutPic, setAboutPic] = useState(""); // URL of About Page Pic
  const [aboutPicMessage, setAboutPicMessage] = useState("");

  const [homePic, setHomePic] = useState(""); // Home page profile pic URL
  const [homePicMessage, setHomePicMessage] = useState("");

  useEffect(() => {
    if (selected === "About Page Pic") {
      fetch("/api/profile") // reuse your existing API for profile
        .then((res) => res.json())
        .then((data) => {
          if (data.imageUrl) setAboutPic(data.imageUrl);
        })
        .catch((err) => console.error(err));
    }
  }, [selected]);

  useEffect(() => {
    if (selected === "Change Profile Pic") {
      fetch("/api/homeProfilePic")
        .then(async (res) => {
          const data = await res.json(); // parse JSON always
          if (!res.ok) {
            console.warn("API fetch failed:", data.error);
            return;
          }
          if (data?.imageUrl) setHomePic(data.imageUrl);
        })
        .catch((err) => console.error(err));
    }
  }, [selected]);

  const sidebarItems = [
    "Change Profile Pic",
    "About Page Pic",
    "Post Work",
    "Update Work",
    "Messages",
    "Settings",
  ];

  const stats = [
    { title: "Total Visits Today", value: "1,234" },
    { title: "This Month", value: "12,345" },
    { title: "This Year", value: "123,456" },
  ];

  // -------------------- POST WORK --------------------
  const handlePostWork = async () => {
    if (!title || !description) {
      setMessage("Title and Description are required!");
      return;
    }

    const project = {
      title,
      description,
      techStack: techStack.split(",").map((t) => t.trim()),
      image,
      url,
      github, // <-- include GitHub URL
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const data = await res.json();
      setMessage(data.message || "Project added successfully!");

      // Clear form
      setTitle("");
      setDescription("");
      setTechStack("");
      setImage("");
      setUrl("");
      setGithub("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add project.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // -------------------- UPDATE WORK --------------------
  const handleUpdateWork = async () => {
    if (!editProject) return;

    const { _id, title, description, techStack, image, url, github } =
      editProject;

    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          updates: { title, description, techStack, image, url, github },
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Project updated successfully!");

      // Refresh project list
      const updatedList = projectsList.map((p) =>
        p._id === _id
          ? { ...p, title, description, techStack, image, url, github }
          : p,
      );
      setProjectsList(updatedList);

      // Optionally clear editProject or leave it open
      // setEditProject(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update project.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // -------------------- FETCH PROJECTS --------------------
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjectsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // -------------------- MESSAGES --------------------
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages whenever the Messages tab is selected
  useEffect(() => {
    if (selected === "Messages") {
      fetchMessages();
    }
  }, [selected]);

  return (
    <section className="min-h-screen flex text-white overflow-hidden">
      {/* ----------------- LEFT SIDEBAR ----------------- */}
      <aside className="w-1/5 backdrop-blur-lg border-r border-violet-500/50 p-6 flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6 text-center"
        >
          Admin Panel
        </motion.h2>

        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item) => (
            <motion.button
              key={item}
              onClick={() => setSelected(item)}
              whileHover={{ scale: 1.05 }}
              animate={{
                backgroundColor:
                  selected === item
                    ? "rgba(139, 92, 246, 0.7)" // violet-600/70
                    : "transparent",
                boxShadow:
                  selected === item
                    ? "0 0 10px rgba(139, 92, 246, 0.4)"
                    : "none",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`text-left px-4 py-2 rounded-lg transition-colors cursor-pointer`}
            >
              {item}
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* ----------------- MIDDLE MAIN AREA ----------------- */}
      <main className="w-3/5 p-6 flex flex-col gap-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl font-bold">{selected}</h2>

            {/* ----------------- Home Profile Pic ----------------- */}
            {selected === "Change Profile Pic" && (
              <motion.div className="backdrop-blur-lg border border-violet-500/40 rounded-xl p-6 flex flex-col gap-4">
                <label className="text-white font-medium">
                  Current Home Profile Pic
                </label>
                {homePic ? (
                  <img
                    src={homePic}
                    alt="Home Profile Pic"
                    className="w-48 h-48 object-cover rounded-2xl border border-violet-600/50"
                  />
                ) : (
                  <p className="text-neutral-400">No image set yet.</p>
                )}

                {/* Input for URL */}
                <input
                  type="text"
                  placeholder="Enter new image URL"
                  value={homePic}
                  onChange={(e) => setHomePic(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />

                {/* Upload from device */}
                <input
                  type="file"
                  accept="image/*"
                  className="border border-purple-400 px-5 py-2 rounded-xl cursor-pointer"
                  onChange={async (e) => {
                    const selectedFile = e.target.files?.[0];
                    if (!selectedFile) return;

                    const formData = new FormData();
                    formData.append("file", selectedFile); // ✅ FIXED

                    try {
                      const res = await fetch("/api/homeProfilePic", {
                        method: "PATCH",
                        body: formData, // ✅ no headers
                      });

                      const data = await res.json();

                      if (!res.ok) {
                        setHomePicMessage(data.error || "Upload failed");
                        return;
                      }

                      setHomePic(data.url);
                      setHomePicMessage("Uploaded successfully!");
                    } catch (err) {
                      console.error(err);
                      setHomePicMessage("Upload failed");
                    }

                    setTimeout(() => setHomePicMessage(""), 3000);
                  }}
                />

                {/* Save button */}
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/homeProfilePic", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: homePic }),
                      });
                      const data = await res.json();
                      setHomePicMessage(
                        data.message || "Updated successfully!",
                      );
                      setTimeout(() => setHomePicMessage(""), 3000);
                    } catch (err) {
                      console.error(err);
                      setHomePicMessage("Failed to update picture.");
                      setTimeout(() => setHomePicMessage(""), 3000);
                    }
                  }}
                  className="bg-violet-600/70 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-violet-900/30 hover:scale-105 transition-transform cursor-pointer"
                >
                  Save
                </button>

                {homePicMessage && (
                  <p className="text-green-400">{homePicMessage}</p>
                )}
              </motion.div>
            )}

            {/* ----------------- About Page Pic ----------------- */}
            {selected === "About Page Pic" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-lg border border-violet-500/40 rounded-xl p-6 shadow-md shadow-violet-700/20 flex flex-col gap-4"
              >
                <label className="text-white font-medium">
                  Current About Page Pic
                </label>
                {aboutPic ? (
                  <img
                    src={aboutPic}
                    alt="About Page Pic"
                    className="w-48 h-48 object-cover rounded-2xl border border-violet-600/50"
                  />
                ) : (
                  <p className="text-neutral-400">No image set yet.</p>
                )}

                <input
                  type="text"
                  placeholder="Enter new image URL"
                  value={aboutPic}
                  onChange={(e) => setAboutPic(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/profile", {
                        method: "PATCH", // use PATCH for update
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: aboutPic }),
                      });

                      const data = await res.json();
                      setAboutPicMessage(
                        data.message || "Updated successfully!",
                      );
                      setTimeout(() => setAboutPicMessage(""), 3000);
                    } catch (err) {
                      console.error(err);
                      setAboutPicMessage("Failed to update picture.");
                      setTimeout(() => setAboutPicMessage(""), 3000);
                    }
                  }}
                  className="bg-violet-600/70 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-violet-900/30 hover:scale-105 transition-transform cursor-pointer"
                >
                  Save
                </button>

                {aboutPicMessage && (
                  <p className="text-green-400">{aboutPicMessage}</p>
                )}
              </motion.div>
            )}

            {/* ----------------- POST WORK ----------------- */}
            {selected === "Post Work" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-lg border border-violet-500/40 rounded-xl p-6 shadow-md shadow-violet-700/20 flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Work Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />
                <textarea
                  rows={5}
                  placeholder="Work Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400 resize-none"
                />
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated)"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Project URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />
                <input
                  type="text"
                  placeholder="GitHub Repository URL"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                />

                <button
                  onClick={handlePostWork}
                  className="bg-violet-600/70 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-900/30 hover:scale-105 transition-transform cursor-pointer"
                >
                  Post Work
                </button>

                {message && <p className="text-green-400 mt-2">{message}</p>}
              </motion.div>
            )}

            {/* ----------------- UPDATE WORK ----------------- */}
            {selected === "Update Work" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backdrop-blur-lg border border-violet-500/40 rounded-xl p-6 shadow-md shadow-violet-700/20 flex flex-col gap-4"
              >
                {/* Select project */}
                <label className="text-white font-medium">
                  Select Project to Edit
                </label>
                <select
                  value={editProject?._id || ""}
                  onChange={(e) => {
                    const proj = projectsList.find(
                      (p) => p._id === e.target.value,
                    );
                    setEditProject(proj || null);
                  }}
                  className="px-4 py-2 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white bg-black/30"
                >
                  <option value="">-- Select Project --</option>
                  {projectsList.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>

                {editProject && (
                  <>
                    <label className="text-white font-medium">Work Title</label>
                    <input
                      type="text"
                      placeholder="Work Title"
                      value={editProject.title}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          title: e.target.value,
                        })
                      }
                      className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                    />

                    <label className="text-white font-medium">
                      Work Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Work Description"
                      value={editProject.description}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          description: e.target.value,
                        })
                      }
                      className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400 resize-none"
                    />

                    <label className="text-white font-medium">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Tech Stack"
                      value={editProject.techStack.join(", ")}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          techStack: e.target.value
                            .split(",")
                            .map((t) => t.trim()),
                        })
                      }
                      className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                    />

                    <label className="text-white font-medium">Image URL</label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={editProject.image}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          image: e.target.value,
                        })
                      }
                      className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                    />

                    <label className="text-white font-medium">
                      Project URL
                    </label>
                    <input
                      type="text"
                      placeholder="Project URL"
                      value={editProject.url}
                      onChange={(e) =>
                        setEditProject({ ...editProject, url: e.target.value })
                      }
                      className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                    />

                    <label className="text-white font-medium">Github URL</label>
                    <input
                      type="text"
                      placeholder="Github URL"
                      value={editProject.github || ""}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          github: e.target.value,
                        })
                      }
                      className="px-4 py-3 rounded-lg border border-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-neutral-400"
                    />

                    <button
                      onClick={handleUpdateWork}
                      className="bg-violet-600/70 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-900/30 hover:scale-105 transition-transform cursor-pointer"
                    >
                      Update Project
                    </button>
                  </>
                )}

                {message && <p className="text-green-400 mt-2">{message}</p>}
              </motion.div>
            )}

            {/* ----------------- Messages ----------------- */}
            {selected === "Messages" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
              >
                {messages.length === 0 ? (
                  <p className="text-neutral-400">No messages yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      onClick={() => setSelectedMessage(msg)}
                      className="border border-violet-600/40 rounded-lg p-4 flex flex-col gap-2 hover:bg-violet-900/20 transition cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-violet-400">
                          {msg.name}
                        </p>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation(); // Prevent selecting message
                            try {
                              const res = await fetch(`/api/messages`, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ _id: msg._id }),
                              });
                              if (res.ok) {
                                setMessages(
                                  messages.filter((m) => m._id !== msg._id),
                                );
                                if (selectedMessage?._id === msg._id)
                                  setSelectedMessage(null);
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="text-red-500 hover:text-red-400 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-neutral-400">
                        {msg.message.substring(0, 50)}...
                      </p>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ----------------- RIGHT STATS PANEL ----------------- */}
      <aside className="w-1/5 backdrop-blur-lg border-l border-violet-500/50 p-6 flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4 text-center"
        >
          Stats
        </motion.h2>

        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg p-4 shadow-md shadow-violet-700/20 text-center"
          >
            <p className="text-neutral-400">{stat.title}</p>
            <p className="text-3xl font-bold text-violet-400">{stat.value}</p>
          </motion.div>
        ))}
      </aside>

      {/* ---------- MESSAGE POPUP MODAL ---------- */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            key="message-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black pointer-events-auto"
              onClick={() => setSelectedMessage(null)}
            />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative pointer-events-auto bg-black/90 border border-violet-500/50 backdrop-blur-lg rounded-xl shadow-lg shadow-violet-700/30 w-[40vw] h-[60vh] p-6 flex flex-col gap-4 z-50 overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                &times;
              </button>

              <h3 className="text-xl font-bold text-violet-400">
                {selectedMessage.name}
              </h3>
              <p className="text-neutral-300">
                <span className="font-semibold">Email:</span>{" "}
                {selectedMessage.email}
              </p>
              <p className="text-neutral-300">
                <span className="font-semibold">Message:</span>{" "}
                {selectedMessage.message}
              </p>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/messages`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ _id: selectedMessage._id }),
                    });
                    if (res.ok) {
                      setMessages(
                        messages.filter((m) => m._id !== selectedMessage._id),
                      );
                      setSelectedMessage(null);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="mt-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
              >
                Delete Message
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

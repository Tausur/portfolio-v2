"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

export type Project = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  url?: string;
  github?: string;
};

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="
        group relative overflow-hidden rounded-2xl
        bg-black border border-violet-900/40
        shadow-lg shadow-violet-900/10
      "
    >
      {/* ---------- IMAGE AREA ---------- */}
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:brightness-75"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

          {/* ---------- DESKTOP HOVER BUTTONS ---------- */}
          <div
            className="
              hidden md:flex
              absolute bottom-4 left-4 right-4 flex items-center justify-between 
              opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
              transition duration-300
            "
          >
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-white bg-violet-600/90 hover:bg-violet-500 px-4 py-2 rounded-full shadow-md shadow-violet-900/40"
              >
                Visit Site
                <ArrowRight size={16} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700"
                aria-label="GitHub Repository"
              >
                <Github size={18} />
              </a>
            )}
          </div>

          {/* ---------- MOBILE BUTTONS ---------- */}
          <div className="flex md:hidden absolute bottom-4 left-4 right-4 justify-between gap-2">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-violet-600/90 hover:bg-violet-500 px-4 py-2 rounded-full shadow-md shadow-violet-900/40"
              >
                Visit Site
                <ArrowRight size={16} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700"
                aria-label="GitHub Repository"
              >
                <Github size={18} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ---------- CONTENT ---------- */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(project.techStack || []).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-violet-900/30 text-violet-300 border border-violet-800/40"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import ProjectCard, { Project } from "./ProjectCard";

export const Featured: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects/featured");
        const data = await res.json();

        const formatted: Project[] = data
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3)
          .map((p: any) => ({
            _id: p._id,
            title: p.title,
            description: p.description || "No description",
            url: p.url,
            github: p.githubUrl || undefined,
            image: p.image || undefined,
            techStack: p.techStack || [],
          }));

        setProjects(formatted);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 text-center">
          Featured Work
        </h2>

        <Link
          href="/projects"
          className="flex items-center justify-end gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-7"
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center text-neutral-400 col-span-3">
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <p className="text-center text-neutral-400 col-span-3">
              No projects found.
            </p>
          ) : (
            projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

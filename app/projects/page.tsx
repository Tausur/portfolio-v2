import ProjectCard from "@/components/ProjectCard";

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    next: { revalidate: 10 }, // optional ISR: revalidate every 10s
  });

  if (!res.ok) {
    console.error("Failed to fetch projects");
    return [];
  }

  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto mb-14">
        <h1 className="text-4xl md:text-6xl font-bold text-white">Projects</h1>
        <p className="mt-4 text-neutral-400 max-w-2xl">
          Selected projects focused on AI, systems, and engineering depth.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any, index: number) => (
          <ProjectCard
            key={project._id}
            project={{
              ...project,
              tech: project.techStack,
            }}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

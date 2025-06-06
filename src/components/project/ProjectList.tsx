import ProjectCard from "./ProjectCard";

const projects = [
  { name: "My Trello board" },
  { name: "DevTask API" },
  { name: "Team Management Tool" },
];

const ProjectList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, idx) => (
        <ProjectCard key={idx} name={project.name} />
      ))}
    </div>
  );
};

export default ProjectList;

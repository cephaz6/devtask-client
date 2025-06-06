import { Card, CardContent } from "@/components/ui/card";

interface ProjectCardProps {
  name: string;
}

const ProjectCard = ({ name }: ProjectCardProps) => {
  return (
    <Card>
      <CardContent className="h-28 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
        <span className="text-white font-bold text-lg">{name}</span>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

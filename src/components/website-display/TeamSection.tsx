
import { FC } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image_url?: string;
  display_order: number;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export const TeamSection: FC<TeamSectionProps> = ({ members }) => {
  if (!members || members.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/10 to-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members
            .sort((a, b) => a.display_order - b.display_order)
            .map((member) => (
              <div key={member.id} className="group text-center">
                {member.image_url && (
                  <div className="relative mb-4 mx-auto w-40 h-40 rounded-full overflow-hidden">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

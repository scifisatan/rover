
import { FC } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

interface ContactSectionProps {
  email?: string;
  phone?: string;
  address?: string;
}

export const ContactSection: FC<ContactSectionProps> = ({ email, phone, address }) => {
  if (!email && !phone && !address) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {email && (
            <a
              href={`mailto:${email}`}
              className="group flex flex-col items-center p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
            >
              <Mail className="h-8 w-8 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {email}
              </span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="group flex flex-col items-center p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
            >
              <Phone className="h-8 w-8 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {phone}
              </span>
            </a>
          )}
          {address && (
            <div className="group flex flex-col items-center p-6 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
              <MapPin className="h-8 w-8 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors text-center">
                {address}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

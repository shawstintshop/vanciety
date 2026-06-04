import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Truck } from "lucide-react";

export interface VanCardProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  van_type: string | null;
}

interface VanCardProps {
  profile: VanCardProfile;
}

const formatJoinDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });
};

const getInitials = (name: string | null): string => {
  if (!name) return "VA";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const VanCard = ({ profile }: VanCardProps) => {
  const displayName = profile.display_name || "Anonymous Vanlifer";

  return (
    <Card className="group hover:shadow-glow transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-14 h-14 border-2 border-border">
          {profile.avatar_url && (
            <AvatarImage src={profile.avatar_url} alt={displayName} />
          )}
          <AvatarFallback className="bg-gradient-forest text-white">
            {getInitials(profile.display_name)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {displayName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-muted-foreground" />
          {profile.van_type ? (
            <Badge variant="secondary">{profile.van_type}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">
              Van status not set
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          <span>Joined {formatJoinDate(profile.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VanCard;

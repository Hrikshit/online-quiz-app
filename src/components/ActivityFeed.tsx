import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="bg-card border-white/5 h-full flex flex-col max-h-[600px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Live Activity
        </CardTitle>
        <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse">
          LIVE
        </Badge>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-6 pt-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <Avatar className="w-10 h-10 border border-white/10">
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold leading-none">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter shrink-0">
                  {activity.time}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm italic">
              No activity yet. Be the first!
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

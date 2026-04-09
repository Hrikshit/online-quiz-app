import { Card, CardContent } from "@/components/ui/card";
import { Layers, Users, Zap } from "lucide-react";

interface StatsProps {
  quizCount: number;
}

export function Stats({ quizCount }: StatsProps) {
  const stats = [
    {
      label: "TOTAL QUIZZES",
      value: quizCount.toString(),
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "ACTIVE LEARNERS",
      value: "1.2k",
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "MY CREATIONS",
      value: "0",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto w-full">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-white/5 overflow-hidden">
          <CardContent className="p-6 flex flex-col gap-4">
            <span className="text-xs font-bold tracking-widest text-muted-foreground">
              {stat.label}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">{stat.value}</span>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

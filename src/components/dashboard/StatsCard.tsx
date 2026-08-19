interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: "gold" | "green" | "blue" | "purple";
}

const colorClasses = {
  gold: "border-gold/20 bg-gold/5",
  green: "border-green-500/20 bg-green-500/5",
  blue: "border-blue-500/20 bg-blue-500/5",
  purple: "border-purple-500/20 bg-purple-500/5",
};

const iconColors = {
  gold: "text-gold",
  green: "text-green-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
};

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all hover:scale-[1.02] ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-xl font-bold text-white md:text-2xl">{value}</p>
        </div>
        <span className={`text-2xl ${iconColors[color]}`}>{icon}</span>
      </div>
    </div>
  );
}
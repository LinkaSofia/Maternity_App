interface PregnancyProgressProps {
  currentWeek: number;
  percentage: number;
}

export default function PregnancyProgress({ currentWeek, percentage }: PregnancyProgressProps) {
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const weeksLeft = Math.max(0, 40 - currentWeek);

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="progress-ring"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
              <div className="text-xs opacity-90">Concluído</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm opacity-90">
          {weeksLeft > 0 ? "Faltam aproximadamente" : "Bebê nasceu!"}
        </p>
        <p className="text-lg font-semibold">
          {weeksLeft > 0 ? `${weeksLeft} semanas` : "Parabéns! 🎉"}
        </p>
      </div>
    </div>
  );
}

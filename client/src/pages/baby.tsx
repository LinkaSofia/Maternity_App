import { useQuery } from "@tanstack/react-query";
import BabySizeComparison from "@/components/baby-size-comparison";
import { Card, CardContent } from "@/components/ui/card";

export default function Baby() {
  const { data: pregnancy } = useQuery({
    queryKey: ["/api/pregnancies/active"],
  });

  const calculateWeeksPregnant = () => {
    if (!pregnancy?.lastMenstrualPeriod) return 24; // Default for demo
    const lmp = new Date(pregnancy.lastMenstrualPeriod);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(diffInDays / 7);
  };

  const currentWeek = calculateWeeksPregnant();

  return (
    <div className="space-y-6">
      <BabySizeComparison week={currentWeek} detailed />
    </div>
  );
}

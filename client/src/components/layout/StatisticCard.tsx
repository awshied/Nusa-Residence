import { TrendingDown, TrendingUp } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

const StatisticCard = ({
  title,
  value,
  icon,
  subtitle,
  trend,
}: StatisticCardProps) => {
  return (
    <div className="group bg-base-100 rounded-lg shadow-sm p-3 lg:p-6 border border-transparent hover:border-base-content/20 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] lg:text-sm font-semibold font-mona text-base-content/70">
            {title}
          </p>
          <h3 className="text-base lg:text-2xl font-bold lg:font-extrabold font-poppins tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[8px] lg:text-xs font-medium text-base-content/40">
              {subtitle}
            </p>
          )}
          {trend && (
            <div
              className={`flex items-center gap-0.5 lg:gap-1 text-[6px] lg:text-xs font-medium mt-1 ${
                trend.isPositive ? "text-success" : "text-error"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-2 lg:w-4 h-2 lg:h-4" />
              ) : (
                <TrendingDown className="w-2 lg:w-4 h-2 lg:h-4" />
              )}{" "}
              {trend.value}%{" "}
              <span className="text-secondary/70">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`hidden lg:flex w-12 h-12 rounded-full items-center justify-center border-2 border-base-content/70 transition duration-300`}
        >
          {icon && <img src={icon} alt="icon" className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;

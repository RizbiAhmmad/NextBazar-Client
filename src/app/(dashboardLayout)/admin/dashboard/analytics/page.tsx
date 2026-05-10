import AnalyticsDashboard from "@/components/modules/Admin/Analytics/AnalyticsDashboard";

export const metadata = {
  title: "Analytics | NextBazar Admin",
  description: "Advanced platform analytics and performance metrics",
};

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}

import { redirect } from "next/navigation";
import { RoadmapDashboard } from "@/components/career-path/roadmap-dashboard";
import { getCareerRoadmapForViewer } from "../actions";

export default async function CareerPlanPage() {
  const data = await getCareerRoadmapForViewer();
  if (!data) {
    redirect("/career-path");
  }

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <RoadmapDashboard
        timelineLabel={data.timelineLabel}
        goalStatement={data.goalStatement}
        plan={data.plan}
        initialProgress={data.progress}
      />
    </main>
  );
}

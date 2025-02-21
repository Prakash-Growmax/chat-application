import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-white" />
      <div className="relative">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-12 py-16 md:py-24">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2">
              <LucideIcon name="Building2" />
              <span className="text-sm font-medium">CSV Insight AI</span>
            </div>
            <h1 className="max-w-3xl text-xl lg:text-4xl md:text-2xl font-bold">
              Analyze your CSV data with{" "}
              <span className="text-primary">AI-powered insights</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Upload your CSV files and get instant insights through natural
              conversations. Perfect for data analysis, reporting, and decision
              making.
            </p>
            <Button asChild size="lg" className="gap-2 bg-black text-white">
              <Link to="/chat/new">
                Get Started
                <LucideIcon name="ArrowRight" />
              </Link>
            </Button>
          </div>

          <div className="grid w-full max-w-5xl gap-6 md:grid-cols-3 px-4 md:px-3 lg:px-0">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <LucideIcon name={feature.icon ? feature.icon : ""} />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;

const features = [
  {
    title: "CSV Analysis",
    description:
      "Upload any CSV file and get instant insights through natural language conversations.",
    icon: "FileSpreadsheet",
  },
  {
    title: "AI Chat Interface",
    description:
      "Ask questions about your data in plain English and get accurate, detailed responses.",
    icon: "MessageSquare",
  },
  {
    title: "Team Collaboration",
    description:
      "Share insights and analysis with your team members in real-time.",
    icon: "Building2",
  },
];

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBadges,
  useProgress,
  useResetProgress,
  useTotalStars,
} from "../hooks/useQueries";
import type { ScreenProps } from "../types";
import GameHeader from "./GameHeader";

export default function ParentDashboard({ onBack, localStars }: ScreenProps) {
  const { login, clear, loginStatus, identity, isLoggingIn } =
    useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: backendStars } = useTotalStars();
  const { data: badges } = useBadges();
  const resetMutation = useResetProgress();

  const totalStars = localStars + Number(backendStars ?? 0n);
  const [resetOpen, setResetOpen] = useState(false);

  const handleReset = async () => {
    try {
      await resetMutation.mutateAsync();
      toast.success("Progress reset successfully!");
      setResetOpen(false);
    } catch {
      toast.error("Could not reset progress.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 max-w-2xl mx-auto">
      <GameHeader
        title="Parent Corner"
        onBack={onBack}
        stars={localStars}
        emoji="👨‍👩‍👧"
        bgColor="#64748b"
      />

      {!isLoggedIn ? (
        <div className="flex flex-col items-center gap-6 mt-12">
          <div className="text-6xl">🔐</div>
          <h2
            className="text-2xl font-black text-center"
            style={{ color: "#64748b" }}
          >
            Parent Login
          </h2>
          <p className="text-center text-muted-foreground font-bold max-w-xs">
            Sign in with Internet Identity to view your child’s learning
            progress and manage their account.
          </p>
          <button
            type="button"
            className="kid-button px-10 py-4 text-lg"
            style={{ backgroundColor: "#4D96FF", borderBottomColor: "#1D4ED8" }}
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="parent.login_button"
          >
            {isLoggingIn ? "Signing in..." : "🔑 Sign In"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div
              className="rounded-2xl p-4 text-center shadow-md"
              style={{ backgroundColor: "#FFF3CD" }}
            >
              <div className="text-3xl font-black" style={{ color: "#FF9F1C" }}>
                {totalStars}
              </div>
              <div className="text-xs font-black text-muted-foreground">
                Total Stars
              </div>
            </div>
            <div
              className="rounded-2xl p-4 text-center shadow-md"
              style={{ backgroundColor: "#ECFDF5" }}
            >
              <div className="text-3xl font-black" style={{ color: "#6BCB77" }}>
                {progress?.length ?? 0}
              </div>
              <div className="text-xs font-black text-muted-foreground">
                Activities
              </div>
            </div>
            <div
              className="rounded-2xl p-4 text-center shadow-md"
              style={{ backgroundColor: "#EDE9FE" }}
            >
              <div className="text-3xl font-black" style={{ color: "#C77DFF" }}>
                {badges?.length ?? 0}
              </div>
              <div className="text-xs font-black text-muted-foreground">
                Badges
              </div>
            </div>
          </div>

          <div>
            <h3
              className="text-lg font-black mb-2"
              style={{ color: "#4D96FF" }}
            >
              Recent Activities
            </h3>
            <div
              className="rounded-2xl overflow-hidden border-2"
              style={{ borderColor: "#e2e8f0" }}
              data-ocid="parent.table"
            >
              {progressLoading ? (
                <div className="p-6 text-center text-muted-foreground font-bold">
                  Loading...
                </div>
              ) : !progress || progress.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground font-bold">
                  No activities yet. Start playing!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-black">Activity</TableHead>
                      <TableHead className="font-black">Stars</TableHead>
                      <TableHead className="font-black">Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progress.map((entry) => (
                      <TableRow
                        key={`${entry.activityName}-${Number(entry.starsEarned)}-${Number(entry.levelReached)}`}
                      >
                        <TableCell className="font-bold">
                          {entry.activityName}
                        </TableCell>
                        <TableCell className="font-bold">
                          ⭐ {Number(entry.starsEarned)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {Number(entry.levelReached)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {badges && badges.length > 0 && (
            <div>
              <h3
                className="text-lg font-black mb-2"
                style={{ color: "#C77DFF" }}
              >
                Badges Earned
              </h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 rounded-full text-white text-sm font-black"
                    style={{ backgroundColor: "#C77DFF" }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="kid-button px-5 py-3 text-sm"
                  style={{
                    backgroundColor: "#FF6B6B",
                    borderBottomColor: "#c0392b",
                  }}
                  data-ocid="parent.reset_button"
                >
                  🗑️ Reset Progress
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="parent.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all stars, badges, and activity
                    history. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="parent.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    style={{ backgroundColor: "#FF6B6B" }}
                    data-ocid="parent.confirm_button"
                  >
                    Yes, Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button
              type="button"
              className="kid-button px-5 py-3 text-sm"
              style={{
                backgroundColor: "#94a3b8",
                borderBottomColor: "#475569",
              }}
              onClick={() => clear()}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

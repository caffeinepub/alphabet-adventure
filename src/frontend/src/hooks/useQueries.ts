import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useTotalStars() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["totalStars"],
    queryFn: async () => {
      if (!actor) return 0n;
      try {
        return await actor.getTotalStars();
      } catch {
        return 0n;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProgress() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getProgress();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBadges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getBadges();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProgress() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (args: {
      activity: string;
      stars: bigint;
      level: bigint;
    }) => {
      if (!actor) return;
      await actor.addProgress(args.activity, args.stars, args.level);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["totalStars"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["badges"] });
    },
  });
}

export function useResetProgress() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.resetProgress();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["totalStars"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["badges"] });
    },
  });
}

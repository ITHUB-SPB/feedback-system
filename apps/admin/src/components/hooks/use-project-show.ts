import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";

export function useProjectShow(showId: number) {
  const { data: project, isLoading } = useQuery(
    orpcClient.project.one.queryOptions({
      input: {
        id: showId,
      },
    }),
  );

  return {
    project,
    isLoading,
  };
}

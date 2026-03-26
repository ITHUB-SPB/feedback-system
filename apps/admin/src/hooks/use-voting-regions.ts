import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/components/fields/use-select-from-query";

export default function useVotingRegions() {
  const { data, isLoading, isError } = useQuery(
    orpcClient.votingRegion.all.queryOptions({}),
  );

  const { selectProps } = useSelectFromQuery({
    data: data ?? [],
  });

  return {
    data,
    isLoading,
    isError,
    selectProps,
  };
}

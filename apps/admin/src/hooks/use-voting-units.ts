import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/components/fields/use-select-from-query";

export default function useVotingUnits() {
  const { data, isLoading, isError } = useQuery(
    orpcClient.votingUnit.all.queryOptions({
      input: {
        sort: "title.asc",
      },
    }),
  );

  const { selectProps } = useSelectFromQuery({
    data: data ?? [],
  });

  // const { selectProps: votingUnitSelectProps } = useSelect({
  //     resource: "voting_units",
  //     pagination: {
  //         pageSize: 48,
  //         mode: "server",
  //     },
  //     sorters: [{ field: "title", order: "asc" }],
  // });

  return {
    data,
    isLoading,
    isError,
    selectProps,
  };
}

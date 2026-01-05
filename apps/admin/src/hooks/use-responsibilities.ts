import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/components/fields/use-select-from-query";

export function useResponsibilities() {
  const { data, isLoading, isError } = useQuery(
    orpcClient.officialResponsibility.all.queryOptions({
      input: {},
    }),
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

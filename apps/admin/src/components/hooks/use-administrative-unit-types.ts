import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/core/refine-antd";

export default function useAdministrativeUnitTypes() {
  const { data, isLoading, isError } = useQuery(
    orpcClient.administrativeUnitType.all.queryOptions({
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

import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/core/refine-antd";

type HookProps = {
  filter?: string | string[];
};

export function useAdministrativeUnits(props: HookProps = {}) {
  const { data, isLoading, isError } = useQuery(
    orpcClient.administrativeUnit.all.queryOptions({
      input: props,
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

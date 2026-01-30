import { useSelectFromQuery } from "@/components/fields/use-select-from-query";
import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";

export default function useOfficials() {
  const { data, isLoading, isError } = useQuery(
    orpcClient.official.all.queryOptions({
      input: {},
    }),
  );

  const { selectProps } = useSelectFromQuery({
    data: data?.data ?? [],
    optionLabel: (item) =>
      `${item.lastName} ${item.firstName} ${item?.middleName ?? ""}`,
    optionValue: (item) => String(item.id),
  });

  return {
    data,
    isLoading,
    isError,
    selectProps,
  };
}

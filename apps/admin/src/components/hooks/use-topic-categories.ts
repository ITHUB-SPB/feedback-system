import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/core/refine-antd";

type QueryProps = {
  filter?: string;
};

export default function useTopicCategories(props: QueryProps = {}) {
  const { data, isLoading, isError } = useQuery(
    orpcClient.topicCategory.all.queryOptions({
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

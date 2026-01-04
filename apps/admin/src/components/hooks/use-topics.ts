import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";
import { useSelectFromQuery } from "@/core/refine-antd";

type QueryProps = {
  filter?: string;
};

export default function useTopics(props: QueryProps = {}) {
  const { data, isLoading, isError } = useQuery(
    orpcClient.topic.all.queryOptions({
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

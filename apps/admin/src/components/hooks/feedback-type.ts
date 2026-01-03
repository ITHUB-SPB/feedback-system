import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-provider";
import { useSelectFromQuery } from "@/core/refine-antd";

type HookProps = {
    filter?: string | string[]
}

export default function useFeedbackType(props: HookProps = {}) {
    const { data, isLoading, isError } = useQuery(
        orpcClient.feedbackType.all.queryOptions({
            input: props,
        }),
    );

    const { selectProps } = useSelectFromQuery({
        data: data ?? [],
        optionLabel: "title",
        optionValue: "id"
    });

    return {
        data,
        isLoading,
        isError,
        selectProps
    };
}

import { useQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-provider";
import { useSelectFromQuery } from "@/core/refine-antd";

type HookProps = {
    filter?: string | string[]
}

export default function useFeedbackStatus(props: HookProps = {}) {
    const { data, isLoading, isError } = useQuery(
        orpcClient.feedbackStatus.all.queryOptions({
            input: props,
        }),
    );

    const { selectProps } = useSelectFromQuery({
        data: data ?? [],
        optionLabel: "translation",
        optionValue: "id"
    });

    return {
        data,
        isLoading,
        isError,
        selectProps
    };
}
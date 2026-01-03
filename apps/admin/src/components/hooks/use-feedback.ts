import { useSuspenseQuery } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-provider";

export function useFeedbackOne(id: number) {
    const { data } = useSuspenseQuery(
        orpcClient.feedback.one.queryOptions({
            input: {
                id
            }
        }),
    );

    return { data }
}
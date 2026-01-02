import { useUpdate, type HttpError } from "@/core/refine-core";
import type { FeedbackContract } from "@/types";

export default function useUpdateStatus(feedbackId: number) {
    const { mutate: updateStatus } = useUpdate<{}, HttpError, FeedbackContract["inputs"]["update"]["body"]>({
        resource: "feedback",
        id: Number(feedbackId),
        successNotification: false,
        errorNotification: false,
    });

    return updateStatus
}
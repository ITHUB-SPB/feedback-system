import { useState } from "react";
import { useCreate } from "@refinedev/core";

import type { OfficialResponsibilityContract } from "@/types";

export function useOfficialAttach() {
    const { mutate: attachOfficial, mutation: attachOfficialMutation } =
        useCreate<OfficialResponsibilityContract["create"]>({
            resource: "official_responsibilities",
            successNotification: {
                message: "Ответственный закреплен",
                type: "success",
            },
            errorNotification: {
                message: "Назначение не удалось",
                type: "error",
            },
        });

    const [isAttaching, setIsAttaching] = useState(false);
    const [attachingUnitId, setAttachingUnitId] = useState<number | null>(null);
    const [attachingOfficialId, setAttachingOfficialId] = useState<string | null>(
        null,
    );

    return {
        attachOfficial,
        attachOfficialMutation,
        isAttaching,
        setIsAttaching,
        attachingUnitId,
        setAttachingUnitId,
        attachingOfficialId,
        setAttachingOfficialId,
    };
}

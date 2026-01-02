import { useState } from "react";
import { useCreate, useInvalidate } from "@/core/refine-core";

import type { IResponsibility } from "../types";

export function useAttach() {
  const invalidate = useInvalidate()

  const { mutate: attachOfficial, mutation: attachOfficialMutation } =
    useCreate<IResponsibility>({
      resource: "official_responsibilities",
      successNotification: {
        message: "Ответственный закреплен",
        type: "success",
      },
      errorNotification: {
        message: "Назначение не удалось",
        type: "error",
      },
      mutationOptions: {
        onSuccess: () => {
          invalidate({
            resource: "official_responsibilities",
            invalidates: ["all"]
          })

          invalidate({
            resource: "administrative_units",
            invalidates: ["all"]
          })
        }
      }
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

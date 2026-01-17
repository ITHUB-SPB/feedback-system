import { useQueryClient } from "@tanstack/react-query";
import { useModalForm } from "@/components/forms/use-modal-form";
import type { VotingUnitContract } from "@/types";

export default function useVotingUnitCreate() {
  const queryClient = useQueryClient();

  const { modalProps, formProps, show } = useModalForm<
    Pick<VotingUnitContract["create"], "title" | "voting_region_id">
  >({
    action: "create",
    resource: "voting_units",
    redirect: false,
    successNotification: {
      type: "success",
      description: "Успешно",
      message: "Поселение добавлено",
    },
    errorNotification: {
      type: "error",
      description: "Ошибка",
      message: "Не удалось добавить поселение",
    },
    onMutationSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["votingRegion"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["votingUnit"],
        refetchType: "all",
      });
    },
  });

  return {
    modalProps,
    formProps,
    show,
  };
}

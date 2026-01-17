import { useQueryClient } from "@tanstack/react-query";
import { useModalForm } from "@/components/forms/use-modal-form";
import type { VotingRegionContract } from "@/types";

export default function useVotingRegionCreate() {
  const queryClient = useQueryClient();

  const { modalProps, formProps, show } = useModalForm<
    Pick<VotingRegionContract["create"], "title">
  >({
    action: "create",
    resource: "voting_regions",
    redirect: false,
    successNotification: {
      type: "success",
      description: "Успешно",
      message: "Район добавлен",
    },
    errorNotification: {
      type: "error",
      description: "Ошибка",
      message: "Не удалось добавить район",
    },
    onMutationSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["votingRegion"],
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

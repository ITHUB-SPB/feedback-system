import { useModalForm } from "@/core/refine-antd";
import type { VotingUnitContract } from "@/types";

export default function useVotingUnitCreate() {
  const { modalProps, formProps, show } = useModalForm<
    Pick<VotingUnitContract["create"], "title" | "voting_region_id">
  >({
    action: "create",
    resource: "voting_units",
    redirect: false,
  });

  return {
    modalProps,
    formProps,
    show,
  };
}

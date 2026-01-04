import { useModalForm } from "@/core/refine-antd";
import type { VotingRegionContract } from "@/types";

export default function useVotingRegionCreate() {
  const { modalProps, formProps, show } = useModalForm<
    Pick<VotingRegionContract["create"], "title">
  >({
    action: "create",
    resource: "voting_regions",
    redirect: false,
  });

  return {
    modalProps,
    formProps,
    show,
  };
}

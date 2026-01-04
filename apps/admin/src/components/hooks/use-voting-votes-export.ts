import { useExport } from "@refinedev/core";
import type { VotingVoteContract } from "@/types";

export default function useVotingVotesExport() {
  const { triggerExport, isLoading } = useExport({
    pageSize: 48,
    resource: "voting_votes",
    meta: {
      export: true,
    },
    mapData: (item: VotingVoteContract["all"][0]) => ({
      Респондент: item.username,
      Описание: item.description,
      Поселение: item.voting_unit,
      Район: item.voting_region,
      Дата: new Date(item.created_at).toLocaleString("ru-RU"),
    }),
  });

  return {
    triggerExport,
    isLoading,
  };
}

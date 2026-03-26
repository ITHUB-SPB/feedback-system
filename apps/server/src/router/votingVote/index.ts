import allVotingVotes from "./votingVote.all";
import createVotingVote from "./votingVote.create";
import deleteVotingVote from "./votingVote.delete";

const votingVoteRouter = {
  all: allVotingVotes,
  create: createVotingVote,
  delete: deleteVotingVote,
};

export default votingVoteRouter;

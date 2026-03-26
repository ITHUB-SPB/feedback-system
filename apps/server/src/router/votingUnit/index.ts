import allVotingUnits from "./votingUnit.all";
import updateVotingUnit from "./votingUnit.update";
import createVotingUnit from "./votingUnit.create";
import deleteVotingUnit from "./votingUnit.delete";

const votingUnitRouter = {
  all: allVotingUnits,
  create: createVotingUnit,
  update: updateVotingUnit,
  delete: deleteVotingUnit,
};

export default votingUnitRouter;

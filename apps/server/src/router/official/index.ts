import allOfficial from "./official.all";
import createOfficial from "./official.create";
import updateOfficial from "./official.update";
import deleteOfficial from "./official.delete";
import oneOfficial from "./official.one";

const officialRouter = {
  all: allOfficial,
  create: createOfficial,
  update: updateOfficial,
  delete: deleteOfficial,
  one: oneOfficial,
};

export default officialRouter;

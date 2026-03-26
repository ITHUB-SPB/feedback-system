import allAdministrativeUnits from "./administrativeUnit.all";
import createAdministrativeUnit from "./administrativeUnit.create";
import updateAdministrativeUnit from "./administrativeUnit.update";
import deleteAdministrativeUnit from "./administrativeUnit.delete";

const administrativeUnitRouter = {
  all: allAdministrativeUnits,
  create: createAdministrativeUnit,
  update: updateAdministrativeUnit,
  delete: deleteAdministrativeUnit,
};

export default administrativeUnitRouter;

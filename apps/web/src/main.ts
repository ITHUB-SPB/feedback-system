import State from "./state";
import FormManager from "./form-manager";
import MapsManager from "./maps-manager";
import { TableFeedbackManager } from "./table-manager";

const state = new State();

document.addEventListener("DOMContentLoaded", async function () {
  await state.init();

  const formManager = new FormManager({ state });
  const tableFeedbackManager = new TableFeedbackManager({ state });
  const mapsManager = new MapsManager({ state, table: tableFeedbackManager });

  const selectOnMapButton = document.getElementById(
    "selectOnMap",
  ) as HTMLButtonElement;

  const renderTableButton = document.getElementById(
    "viewIssues",
  ) as HTMLButtonElement;

  renderTableButton.addEventListener("click", () => {
    tableFeedbackManager.renderTable(state.selectedProject);
  });

  selectOnMapButton.addEventListener("click", () => mapsManager.open());
});

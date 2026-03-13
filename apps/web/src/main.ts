import State from "./state";
import FormManager from "./form-manager";
import MapsManager from "./maps-manager";
import { initTooltips } from "./tooltip";
import { TableFeedbackManager } from "./table-manager";
import { IssuesCounter } from "./components/issues-counter";
import { ImageUploader } from "./components/image-uploader";

const state = new State();

document.addEventListener("DOMContentLoaded", async function () {
  initTooltips();

  await state.init();

  if (!customElements.get("issues-counter")) {
    customElements.define("issues-counter", IssuesCounter);
  }

  if (!customElements.get("image-uploader")) {
    customElements.define("image-uploader", ImageUploader);
  }

  const formManager = new FormManager({ state });
  const tableFeedbackManager = new TableFeedbackManager({ state });
  const mapsManager = new MapsManager({ state, table: tableFeedbackManager });

  const selectOnMapButton = document.getElementById(
    "selectOnMap",
  ) as HTMLButtonElement;

  const issueCounters = document.querySelectorAll(
    "issues-counter",
  ) as NodeListOf<IssuesCounter>;

  for (const issueCounter of issueCounters) {
    issueCounter.connectState(state);
    issueCounter.addEventListener("click", () => {
      tableFeedbackManager.renderTable(state.selectedProject);
    });
  }

  selectOnMapButton.addEventListener("click", () => mapsManager.open());
});

window.addEventListener("unload", () => {
  window.scrollTo(0, 0);
});

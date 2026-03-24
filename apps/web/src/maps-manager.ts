declare const ymaps: any;

import type { IssuesCounter } from "./components/issues-counter";
import type State from "./state";
import type { TableFeedbackManager } from "./table-manager";
import * as types from "./types";

type MapsManagerProperties = {
  state: State;
  table: TableFeedbackManager;
};

export default class MapsManager {
  private popupElement = document.getElementById("mapPopup") as HTMLElement;
  private selectedCityElement = document.getElementById(
    "selectedCityName",
  ) as HTMLElement;
  private selectedProjectElement = document.getElementById(
    "selectedProjectName",
  ) as HTMLSpanElement;
  private mapPopupCloseElement = document.querySelector(
    ".map-popup-close",
  ) as HTMLButtonElement;
  private mapApplyElement = document.querySelector(
    ".map-popup-apply",
  ) as HTMLButtonElement;
  private citySelectElement = document.getElementById(
    "citySelect",
  ) as HTMLSelectElement;
  private projectSelectElement = document.getElementById(
    "projectSelect",
  ) as HTMLSelectElement;
  private issueCounterElement = document.querySelector(
    "#mapPopup issues-counter",
  ) as IssuesCounter;

  private table: TableFeedbackManager;
  private state: State;
  private map: any;
  private clusterer: any;
  private selectedProject: types.ProjectContract["output"]["one"] | null = null;

  constructor({ state, table }: MapsManagerProperties) {
    this.state = state;
    this.table = table;
    this.init();
  }

  private init() {
    ymaps.ready(() => {
      this.setupEventListeners();
    });
  }

  private getBounds(projects: State["projects"]) {
    return projects.reduce(
      (acc, project) => {
        const { latitude, longitude } = project;
        if (latitude === 0 || longitude === 0) {
          return acc;
        }
        return {
          minLatitude: Math.min(latitude, acc.minLatitude),
          minLongitude: Math.min(longitude, acc.minLongitude),
          maxLatitude: Math.max(latitude, acc.maxLatitude),
          maxLongitude: Math.max(longitude, acc.maxLongitude),
        };
      },
      {
        minLatitude: 100,
        minLongitude: 100,
        maxLatitude: 0,
        maxLongitude: 0,
      },
    );
  }

  private async zoomToTown(townProjects: State["projects"]) {
    if (this.state.selectedTown?.title) {
      this.selectedCityElement.textContent = this.state.selectedTown?.title;
    }

    this.selectedProjectElement.textContent = "Не выбран";

    const { minLatitude, minLongitude, maxLatitude, maxLongitude } =
      this.getBounds(townProjects);

    await this.map.setBounds([
      [minLatitude - 0.2, minLongitude - 0.2],
      [maxLatitude + 0.2, maxLongitude + 0.2],
    ]);

    await this.map.setZoom(13);
  }

  private async zoomToProject(projectId: string | number) {
    const project = this.state.projects.find(
      (project) => project.id == Number(projectId),
    )!;

    this.selectedCityElement.textContent = project.administrative_unit;
    this.selectedProjectElement.textContent = `${project.title} (${project.year_of_completion})`;
    this.map.setCenter([project.latitude, project.longitude], 15);
  }

  private async loadProjects(projects: State["projects"]) {
    const getIconContent = (quantity: number): string | undefined => {
      if (quantity === 0) {
        return undefined;
      }

      const cases = [2, 0, 1, 1, 1, 2] as const;
      const titles = ["предложение", "предложения", "предложений"] as const;

      if (quantity % 100 > 4 && quantity % 100 < 20) {
        return `${quantity} ${titles[2]}`;
      } else if (quantity % 10 < 5) {
        const titleIx = cases[quantity % 10] as number;
        return `${quantity} ${titles[titleIx]}`;
      } else {
        return `${quantity} ${titles[cases[5]]}`;
      }
    };

    this.clusterer = new ymaps.Clusterer({
      hasBalloon: false,
      hasHint: false,
      maxZoom: 13,
      gridSize: 128,
      minClusterSize: 2,
      preset: "islands#invertedBlueClusterIcons",
      clusterNumbers: [100],
      clusterIconColor: "#18a763",
    });

    projects.forEach((project) => {
      const coords = [project.latitude, project.longitude];
      const issuesQuantity =
        this.state.issuesByAllProjects[project.id]?.length ?? 0;

      const marker = new ymaps.Placemark(
        coords,
        {
          draggable: false,
          iconContent: getIconContent(issuesQuantity),
        },
        {
          preset: "islands#darkGreenStretchyIcon",
        },
      );

      marker.events.add("click", () => {
        this.selectedProject = project;
        this.selectedProjectElement.textContent = `${project.title} (${project.year_of_completion})`;
        this.selectedCityElement.textContent = project.administrative_unit;

        this.issueCounterElement.setAttribute("projectid", String(project.id));
      });

      this.clusterer.add(marker);
    });

    this.map.geoObjects.add(this.clusterer);
  }

  private apply() {
    if (!this.selectedProject) {
      return;
    }

    this.state.selectedProject = this.selectedProject;

    this.citySelectElement.value = String(
      this.state.selectedProject?.administrative_unit_id,
    );

    this.citySelectElement.dispatchEvent(new Event("input"));

    this.projectSelectElement.value = String(this.state.selectedProject?.id);
    this.projectSelectElement.dispatchEvent(new Event("input"));

    this.close();
  }

  public open() {
    if (this.map) {
      this.map.destroy();
    }

    const townId = Number(this.state.selectedTown!.id);

    const townProjects = this.state.projects.filter(
      (project: types.ProjectContract["output"]["one"]) =>
        project.administrative_unit_id === townId,
    );

    const { minLatitude, minLongitude, maxLatitude, maxLongitude } =
      this.getBounds(townProjects);

    this.map = new ymaps.Map(
      "yandexMap",
      {
        center: [
          (maxLatitude - minLatitude) / 2,
          (maxLongitude - minLongitude) / 2,
        ],
        controls: ["zoomControl", "searchControl", "geolocationControl"],
      },
      {
        restrictMapArea: [
          [minLatitude - 0.2, minLongitude - 0.2],
          [maxLatitude + 0.2, maxLongitude + 0.2],
        ],
      },
    );

    this.loadProjects(townProjects);

    this.popupElement.classList.add("show");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      this.map.container.fitToViewport();
    }, 100);

    if (this.state.selectedProject?.id) {
      this.zoomToProject(this.state.selectedProject.id);
    } else if (this.state.selectedTown) {
      this.zoomToTown(townProjects);
    }
  }

  public close() {
    this.popupElement.classList.remove("show");
    document.body.style.overflow = "";
  }

  private setupEventListeners() {
    this.mapApplyElement.addEventListener("click", () => this.apply());
    this.mapPopupCloseElement.addEventListener("click", () => this.close());
    this.issueCounterElement.addEventListener("click", () => {
      this.table.renderTable(this.selectedProject);
    });

    window.addEventListener("resize", () => {
      this.map.container.fitToViewport();
    });
  }
}

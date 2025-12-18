import DragAndDropManager from "./dnd-manager";
import AlertManager from "./alert-manager";
import { apiClient } from "./api-client";
import * as types from "./types";
import type State from "./state";

type FormManagerProperties = {
  state: State;
};

export default class FormManager {
  public citySelect: HTMLSelectElement;
  public projectSelect: HTMLSelectElement;
  private requestTypeSelect: HTMLSelectElement;
  private categorySelect: HTMLSelectElement;
  private issueSelect: HTMLSelectElement;
  private issueCounter: HTMLButtonElement;

  private categoryContainer: HTMLDivElement;
  private issueContainer: HTMLDivElement;

  private dragAndDrop: DragAndDropManager;
  private alertManager: AlertManager;
  private form: HTMLFormElement;
  private state: State;

  constructor({ state }: FormManagerProperties) {
    this.citySelect = document.getElementById(
      "citySelect",
    ) as HTMLSelectElement;
    this.projectSelect = document.getElementById(
      "projectSelect",
    ) as HTMLSelectElement;
    this.requestTypeSelect = document.getElementById(
      "requestTypeSelect",
    ) as HTMLSelectElement;
    this.categorySelect = document.getElementById(
      "categorySelect",
    ) as HTMLSelectElement;
    this.issueSelect = document.getElementById(
      "issueSelect",
    ) as HTMLSelectElement;
    this.issueCounter = document.querySelector(
      ".view_issues",
    ) as HTMLButtonElement;

    this.categoryContainer = document.getElementById(
      "categoryBlock",
    ) as HTMLDivElement;
    this.issueContainer = document.getElementById(
      "issueBlock",
    ) as HTMLDivElement;

    this.form = document.querySelector(".apply-form") as HTMLFormElement;
    this.dragAndDrop = new DragAndDropManager();
    this.state = state;
    this.alertManager = new AlertManager();
    this.init();
  }

  private async init(): Promise<void> {
    await this.renderCities();
    await this.renderCategories();
    await this.loadTypes();
    this.setupEventListeners();
  }

  private async renderCities(): Promise<void> {
    this.citySelect.innerHTML = '<option value="">Выберите город</option>';
    this.state.cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id.toString();
      option.textContent = city.title;
      this.citySelect.appendChild(option);
    });
  }

  private async renderCategories(): Promise<void> {
    this.categorySelect.innerHTML =
      '<option value="">Выберите категорию</option>';

    this.state.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id.toString();
      option.textContent = category.title;
      this.categorySelect.appendChild(option);
    });
  }

  private async renderIssueQuantity(projectId: number | string | null) {
    function declOfNum(number: number) {
      const cases = [2, 0, 1, 1, 1, 2] as const;
      const titles = ["предложение", "предложения", "предложений"] as const;

      if (number % 100 > 4 && number % 100 < 20) {
        return titles[2]
      } else if (number % 10 < 5) {
        const titleIx = cases[number % 10] as number;
        return titles[titleIx]
      } else {
        return titles[cases[5]]
      }
    }

    if (!projectId) {
      this.issueCounter.style.visibility = "hidden";
      return;
    }

    const issuesByProject = await this.state.loadIssuesByProject(projectId);
    const issuesCount = issuesByProject.length;
    if (issuesCount) {
      this.issueCounter.textContent = `${issuesCount.toString()} ${declOfNum(issuesCount)}`;
    }
    this.issueCounter.style.visibility = issuesCount ? "visible" : "hidden";
  }

  private async renderIssues(categoryId: number | string) {
    this.issueSelect.innerHTML = '<option value="">Выберите проблему</option>';

    const issues = await this.state.loadIssues(categoryId);

    issues.forEach((issue: any) => {
      const option = document.createElement("option");
      option.value = issue.id.toString();
      option.textContent = issue.topic;
      this.issueSelect.appendChild(option);
    });
  }

  private async loadTypes(): Promise<void> {
    this.requestTypeSelect.innerHTML = "";
    this.state.feedbackTypes.forEach(({ id, title }) => {
      const feedbackTypeOption = document.createElement("option");
      feedbackTypeOption.textContent = title;
      feedbackTypeOption.dataset.title = title;
      feedbackTypeOption.value = String(id);
      this.requestTypeSelect.appendChild(feedbackTypeOption);
    });
  }

  private renderProjectsForCity(cityId: string): void {
    this.projectSelect.innerHTML = '<option value="">Выберите проект</option>';

    const cityProjects = this.state.projects.filter(
      (project) => project.administrative_unit_id.toString() === cityId,
    );

    if (!cityProjects.length) {
      this.projectSelect.innerHTML =
        '<option value="">Проекты не найдены</option>';
      return;
    }

    for (const project of cityProjects) {
      const option = document.createElement("option");
      option.value = project.id.toString();
      option.textContent = project.title;
      this.projectSelect.appendChild(option);
    }
  }

  private setupEventListeners(): void {
    this.citySelect.addEventListener("input", (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.value) {
        this.renderProjectsForCity(target.value);
      } else {
        this.projectSelect.innerHTML =
          '<option value="">Сначала выберите город</option>';
      }
      this.renderIssueQuantity(null);
    });

    this.requestTypeSelect.addEventListener("input", () => {
      const selectedOption = this.requestTypeSelect.selectedOptions[0];
      if (selectedOption?.dataset.title === "Замечание") {
        this.categoryContainer.style.display = "block";
        this.issueContainer.style.display = "block";
        this.dragAndDrop.fileInput.setAttribute("required", "required");
      } else {
        this.categoryContainer.style.display = "none";
        this.issueContainer.style.display = "none";
        this.categorySelect.value = "";
        this.issueSelect.value = "";
        this.dragAndDrop.fileInput.removeAttribute("required");
      }
    });

    this.categorySelect.addEventListener("change", () => {
      if (this.categorySelect.value) {
        this.renderIssues(this.categorySelect.value);
        return;
      }

      this.issueSelect.innerHTML =
        '<option value="">Сначала выберите категорию</option>';
    });

    this.projectSelect.addEventListener("change", () => {
      const projectSelectValue = this.projectSelect.value;
      console.log(projectSelectValue);
      this.renderIssueQuantity(projectSelectValue ?? null);
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  private handleFormSubmit(): void {
    const payloadFieldNames = [
      "project_id",
      "description",
      "feedback_type_id",
      "topic_category_topic_id",
      "first_name",
      "last_name",
      "middle_name",
      "email",
      "phone",
    ];

    const formData = new FormData(this.form);

    const formDataObject = [...formData.entries()].reduce(
      (acc, [key, value]) => {
        if (!payloadFieldNames.includes(key) || value === "") {
          return acc;
        }

        return { ...acc, [key]: value };
      },
      {},
    ) as types.Feedback;

    formDataObject.files = this.dragAndDrop.selectedFiles; // .fileInput

    apiClient.feedback
      .create({ body: formDataObject })
      .then(() => {
        this.alertManager.showAlert("Обращение принято", "success");
        this.form.reset();
      })
      .catch((error) => {
        console.error(error);
        this.alertManager.showAlert("Ошибка при отправке", "warning");
      });
  }
}

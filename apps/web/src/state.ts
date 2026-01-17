import { apiClient } from "./api-client";
import * as types from "./types";

export default class State {
  public projects: types.ProjectContract["output"]["one"][] = [];
  public cities: types.AdministrativeUnitContract["output"]["one"][] = [];
  public feedbackTypes: types.FeedbackTypeContract["output"]["all"] = [];
  public issuesByProject: types.FeedbackContract["output"]["all"] = [];
  public categories: types.TopicCategoryContract["output"]["all"] = [];

  public async init() {
    this.projects = await apiClient.project.all({
      filter: "administrative_unit_type.title[eq]town",
    });
    this.cities = await apiClient.administrativeUnit.all({
      filter: "administrative_unit_type.title[eq]town",
      sort: "title.asc",
    });
    this.categories = await apiClient.topicCategory.all();
    this.feedbackTypes = await apiClient.feedbackType.all();
  }

  public async loadIssues(
    categoryId: number | string,
  ): Promise<types.TopicCategoryTopicContract["output"]["all"]> {
    return await apiClient.topicCategoryTopic.all({
      filter: [
        {
          field: "topic_category_id",
          operator: "eq",
          value: String(categoryId),
        },
      ],
    });
  }

  public async loadIssuesByProject(projectId: number | string): Promise<any[]> {
    this.issuesByProject = await apiClient.feedback.all({
      filter: `project_id[eq]${projectId}&feedback_type_id[eq]2&feedback_status_id[in]1,2,4,6`,
    });
    return this.issuesByProject;
  }
}

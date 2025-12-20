import { apiClient } from "./api-client";
import * as types from "./types";

export default class State {
  public projects: types.Project[] = [];
  public cities: types.AdministrativeUnit[] = [];
  public feedbackTypes: types.FeedbackType[] = [];
  public issuesByProject: types.FeedbackIn[] = [];
  public categories: types.TopicCategory[] = [];

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
  ): Promise<types.TopicCategoryTopic[]> {
    return await apiClient.topicCategoryTopic.all({
      filter: `topic_category_id[eq]${categoryId}`,
    });
  }

  public async loadIssuesByProject(
    projectId: number | string,
  ): Promise<any[]> {
    this.issuesByProject = await apiClient.feedback.all({
      filter: `project_id[eq]${projectId}`
    })
    return this.issuesByProject
  }
}

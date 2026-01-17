import type { RouterOutput, RouterInput } from "@shared/api";

export interface AlertManagerInterface {
  showAlert: (message: string, type?: "success" | "warning") => void;
  closeAlert: () => void;
}

export type ProjectContract = {
  input: RouterInput["project"];
  output: RouterOutput["project"];
};

export type AdministrativeUnitContract = {
  input: RouterInput["administrativeUnit"];
  output: RouterOutput["administrativeUnit"];
};

export type FeedbackContract = {
  input: RouterInput["feedback"];
  output: RouterOutput["feedback"];
};

export type FeedbackTypeContract = {
  input: RouterInput["feedbackType"];
  output: RouterOutput["feedbackType"];
};

export type TopicCategoryContract = {
  input: RouterInput["topicCategory"];
  output: RouterOutput["topicCategory"];
};

export type TopicCategoryTopicContract = {
  input: RouterInput["topicCategoryTopic"];
  output: RouterOutput["topicCategoryTopic"];
};

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type_id: number;
  person_type: "citizen" | "official" | "moderator";
}

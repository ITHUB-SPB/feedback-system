import type { RouterOutput, RouterInput } from "@shared/api";

export type User = {
  role: string;
  firstName: string;
  lastName: string | null | undefined;
  middleName: string | null | undefined;
  phone: string | null | undefined;
  social: string | null | undefined;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  banned: boolean | null | undefined;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
};

export type NewUserRecord = Omit<User, "name" | "id" | "created_at">;

export type ProjectContract = RouterOutput["project"];
export type FeedbackContract = {
  inputs: RouterInput["feedback"];
  outputs: RouterOutput["feedback"];
};
export type FeedbackStatusContract = RouterOutput["feedbackStatus"];
export type FeedbackTypeContract = RouterOutput["feedbackType"];
export type TopicContract = RouterOutput["topic"];
export type TopicCategoryContract = RouterOutput["topicCategory"];
export type TopicCategoryTopicContract = RouterOutput["topicCategoryTopic"];
export type AdministrativeUnitContract = RouterOutput["administrativeUnit"];
export type AdministrativeUnitTypeContract =
  RouterOutput["administrativeUnitType"];
export type OfficialResponsibilityContract =
  RouterOutput["officialResponsibility"];
export type VotingUnitContract = RouterOutput["votingUnit"];
export type VotingRegionContract = RouterOutput["votingRegion"];

export type FeedbackStatusEnum = FeedbackStatusContract["all"][0]["title"];

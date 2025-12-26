import { type AdministrativeUnitTypeTable } from "./models/administrative_unit_type";
import { type AdministrativeUnitTable } from "./models/administrative_unit";
import { type TopicTable } from "./models/topic";
import { type TopicCategoryTable } from "./models/topic_category";
import { type TopicCategoryTopicTable } from "./models/topic_category_topic";
import { type FeedbackImageTable } from "./models/feedback_image";
import { type FeedbackStatusTable } from "./models/feedback_status";
import { type FeedbackTypeTable } from "./models/feedback_type";
import { type FeedbackTable } from "./models/feedback";
import { type UserTable } from "./models/user";
import { type ProjectTable } from "./models/project";
import { type OfficialResponsibilityTable } from "./models/official_responsibility";
import { type VotingRegionTable } from "./models/voting_region";
import { type VotingUnitTable } from "./models/voting_unit";
import { type VotingVoteTable } from "./models/voting_vote";

export interface Tables {
  administrative_unit: AdministrativeUnitTable;
  administrative_unit_type: AdministrativeUnitTypeTable;
  topic: TopicTable;
  topic_category: TopicCategoryTable;
  topic_category_topic: TopicCategoryTopicTable;
  feedback_image: FeedbackImageTable;
  feedback_status: FeedbackStatusTable;
  feedback_type: FeedbackTypeTable;
  feedback: FeedbackTable;
  project: ProjectTable;
  official_responsibility: OfficialResponsibilityTable;
  voting_region: VotingRegionTable;
  voting_unit: VotingUnitTable;
  voting_vote: VotingVoteTable;
  user: UserTable;
}

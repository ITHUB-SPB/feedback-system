import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import topicRouter from "./topic";
import topicCategoryRouter from "./topicCategory";
import topicCategoryTopicRouter from "./topicCategoryTopic";
import feedbackRouter from "./feedback";

import officialResponsibilityRouter from "./officialResponsibility";
import officialRouter from "./official";

import votingRegionRouter from "./votingRegion";
import votingUnitRouter from "./votingUnit";
import votingVoteRouter from "./votingVote";

import feedbackTypeRouter from "./enumerations/feedbackType";
import administrativeUnitTypeRouter from "./enumerations/administrativeUnitType";
import feedbackStatusRouter from "./enumerations/feedbackStatus";

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  administrativeUnitTypes: administrativeUnitTypeRouter,
  feedbackType: feedbackTypeRouter,
  feedback_statuses: feedbackStatusRouter,
  topic: topicRouter,
  topicCategories: topicCategoryRouter,
  topicCategoryTopic: topicCategoryTopicRouter,
  feedback: feedbackRouter,
  officialResponsibility: officialResponsibilityRouter,
  official: officialRouter,
  votingRegion: votingRegionRouter,
  votingUnit: votingUnitRouter,
  votingVote: votingVoteRouter,
};

export default apiRouter;

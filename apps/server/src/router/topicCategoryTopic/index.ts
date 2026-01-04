import allTopicCategoryTopics from "./topicCategoryTopic.all";
import createTopicCategoryTopic from "./topicCategoryTopic.create";
import deleteTopicCategoryTopic from "./topicCategoryTopic.delete";

const topicCategoryTopicRouter = {
  all: allTopicCategoryTopics,
  create: createTopicCategoryTopic,
  delete: deleteTopicCategoryTopic,
};

export default topicCategoryTopicRouter;

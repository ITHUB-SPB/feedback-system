import { useModalForm } from "@/components/forms/use-modal-form";
import { type TopicCategoryTopicContract } from "@/types";

export default function useTopicCategoryTopicCreate() {
  const {
    modalProps: topicCategoryTopicModalProps,
    formProps: topicCategoryTopicFormProps,
    show: createTopicCategoryTopicModalShow,
  } = useModalForm<TopicCategoryTopicContract["create"]>({
    action: "create",
    resource: "topic_category_topics",
    redirect: false,
    successNotification: {
      type: "success",
      message: "Пара создана",
      description: "Успешно",
    },
    errorNotification: {
      type: "error",
      message: "Связывание не удалось",
      description: "Ошибка",
    },
  });

  return {
    topicCategoryTopicModalProps,
    topicCategoryTopicFormProps,
    createTopicCategoryTopicModalShow,
  };
}

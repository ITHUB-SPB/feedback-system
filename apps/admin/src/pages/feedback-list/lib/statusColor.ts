import type { ButtonProps } from 'antd/es/button';
import type { FeedbackStatusEnum } from '@/types';

export const getStatusColor = (status: FeedbackStatusEnum) => {
  const colorMap: Record<FeedbackStatusEnum, ButtonProps["color"]> = {
    pending: "orange",
    approved: "blue",
    completed: "green",
    declined: "red",
    banned: "red",
    archived: "default",
    proceeding: "blue",
  };

  return colorMap[status] || "default";
};

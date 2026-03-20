import Typography from "antd/es/typography";
import Tag, { type TagProps } from "antd/es/tag";
import type { FeedbackStatusEnum } from "@/types";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import Duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(Duration);
dayjs.extend(relativeTime);

dayjs.locale("ru");

type ReactionTimeProps = {
  value: Date | number | string;
  status: FeedbackStatusEnum;
  variant?: TagProps["variant"];
};

type AvailableTime = {
  availableDays: number;
  availableHours: number;
};

function getText({ availableDays, availableHours }: AvailableTime) {
  if (availableHours <= 0) {
    return "Требуется ответ";
  } else if (availableDays <= 0) {
    return dayjs.duration(availableHours, "hours").humanize();
  } else {
    return dayjs.duration(availableDays, "days").humanize();
  }
}

function getColor({
  availableDays,
  availableHours,
  status,
}: AvailableTime & Pick<ReactionTimeProps, "status">): TagProps["color"] {
  if (availableHours <= 0) {
    return "red";
  } else if (
    (status === "proceeding" && availableDays < 8) ||
    (status !== "proceeding" && availableHours < 8)
  ) {
    return "volcano";
  } else {
    return "orange";
  }
}

export default function ReactionTime({
  value,
  variant,
  status,
}: ReactionTimeProps) {
  if (["banned", "declined", "completed", "archived"].includes(status)) {
    return "—";
  }

  const daysForAnswer = status === "proceeding" ? 30 : 1;
  const availableHours = dayjs(value)
    .add(daysForAnswer, "day")
    .diff(dayjs(), "hours");
  const availableDays = dayjs(value)
    .add(daysForAnswer, "day")
    .diff(dayjs(), "days");

  return (
    <Tag
      variant={variant ?? "solid"}
      color={getColor({ availableDays, availableHours, status })}
    >
      <Typography.Text
        style={{ color: "inherit", fontSize: "inherit", fontWeight: "bold" }}
      >
        {getText({ availableDays, availableHours })}
      </Typography.Text>
    </Tag>
  );
}

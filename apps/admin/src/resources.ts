export const resources = [
  {
    name: "projects",
    list: "/projects",
    show: "/projects/:id",
    edit: "/projects/:id/edit",
    create: "/projects/create",
    meta: { label: "Проекты" },
  },
  {
    name: "feedback",
    list: "/feedback",
    show: "/feedback/:id",
    meta: { label: "Предложения" },
  },
  {
    name: "citizens",
    list: "/citizens",
    meta: {
      label: "Респонденты",
    },
  },
  {
    name: "officials",
    list: "/officials",
    meta: {
      label: "Администрация",
    },
  },
  {
    name: "topic_category_topics",
    list: "/topic_category_topics",
    meta: {
      label: "Категории",
    },
  },
  {
    name: "administrative_units",
    list: "/administrative_units",
    meta: {
      label: "Поселения",
    },
  },
  {
    name: "voting_votes",
    list: "/voting_votes",
    meta: {
      label: "Результаты",
    },
  },
  {
    name: "voting_units",
    list: "/voting_units",
    meta: {
      label: "Участники",
    },
  },
  {
    name: "voting_regions",
    list: "/voting_regions",
    meta: {
      hide: true,
    },
  }
];

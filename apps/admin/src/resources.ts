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
      parent: "Пользователи",
      label: "Респонденты",
    },
  },
  {
    name: "officials",
    list: "/officials",
    meta: {
      parent: "Пользователи",
      label: "Администрация",
    },
  },
  {
    name: "topic_category_topics",
    list: "/issues",
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
      parent: "Голосование",
      label: "Результаты",
    },
  },
  {
    name: "voting_units",
    list: "/voting_units",
    meta: {
      parent: "Голосование",
      label: "Участники",
    },
  },
  {
    name: "voting_regions",
    list: "/voting_regions",
    meta: {
      hide: true,
    },
  },
]
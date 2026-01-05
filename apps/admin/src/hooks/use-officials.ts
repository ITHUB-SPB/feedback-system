import { useSelect } from "@/components/fields/use-select";
import type { User } from "@/types";

export default function useOfficials() {
  const { selectProps } = useSelect<User>({
    optionLabel: (item) =>
      `${item.lastName} ${item.firstName} ${item?.middleName ?? ""}`,
    optionValue: (item) => String(item.id),
    resource: "officials",
    pagination: {
      pageSize: 48,
      mode: "server",
    },
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "official",
      },
    ],
  });

  return { selectProps };
}

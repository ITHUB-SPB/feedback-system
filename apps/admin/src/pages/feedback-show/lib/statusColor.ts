export const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
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

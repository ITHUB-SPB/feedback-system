import { List } from "@/core/refine-antd";
import FeedbackTable from "./components/feedback-table";


export default function FeedbackListPage() {
  return (
    <List title="Предложения граждан">
      <FeedbackTable />
    </List>
  );
}

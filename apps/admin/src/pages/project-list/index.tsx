import { List } from "@/core/refine-antd";
import ProjectsTable from "./components/projects-table";

export default function ListProjects() {
    return (
        <List title="Реализованные проекты">
            <ProjectsTable />
        </List>
    );
}

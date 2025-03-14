import { getProjects } from "@/lib/actions/projects";
import ProjectsTable from "./components/project-table";
import { type ProjectModel } from "@/lib/definitions/Project";

export default async function ProjectsTableSlot({ username }: { username: string }) {

    const projects: ProjectModel[] = await getProjects();

    return (
        <ProjectsTable data={projects}  username={username}/>
    )
}

// Session
import { verifySession } from "@/lib/session/verifySession"
import { redirect, notFound } from "next/navigation"

import PropCreateModal from "./components/prop-create-modal";
import ProjectHeader from "./components/project-header";


export default async function ProjectPage({
    params,
    searchParams,
}: {
    params: Promise<{ username: string, projectId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { username, projectId } = await params;
    const { modal } = await searchParams;
    const session = await verifySession()

    if (session.username !== username) notFound()
    if (!session.isAuth) redirect('/login')

    return (
        <>
            <ProjectHeader />
            {modal === 'open' && <PropCreateModal />}
        </>
    );
}
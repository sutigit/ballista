"use client";

import { useParams, useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";

export default function EditorHeader() {
  const params = useParams<{ username: string; projectId?: string }>();
  const { username, projectId } = params;

  const [projectName, setProjectName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (projectId) {
      // fetch project name
      setProjectName("Project Name");
    }
  }, []);

  const openCreatePropModal = () => {
    router.push(`/${username}/editor/${projectId}?modal=open`);
  };

  return (
    <div className="flex justify-between items-center px-10 border-b min-h-20">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${username}/dashboard`}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{projectName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Button>Logout</Button>
      </div>
    </div>
  );
}

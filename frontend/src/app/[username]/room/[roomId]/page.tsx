// Session
import { verifySession } from "@/lib/session/verifySession";
import { redirect, notFound } from "next/navigation";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdjustmentSelection = ({
  label,
  options,
}: {
  label: string;
  options: string[];
}) => (
  <Select>
    <SelectTrigger className="w-[300px]">
      <span className="opacity-75">{`${label}:`}</span>
      <SelectValue placeholder="" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {options.map((option) => (
          <SelectItem key={option} value={option.toLowerCase()}>
            {option}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { username, projectId } = await params;
  const session = await verifySession();

  if (session.username !== username) notFound();
  if (!session.isAuth) redirect("/login");

  const AgentRect = ({ color }: { color: string }) => (
    <div className={`h-full aspect-square rounded-sm ${color}`}></div>
  );

  const AgentOption = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center bg-white justify-between gap-3 py-3 pl-4 pr-1 border rounded-full h-12">
      {children}
      <Button variant="ghost">
        <PlusIcon />
      </Button>
    </div>
  );

  const agents = [
    {
      name: "The Idealist",
      color: "bg-yellow-400",
    },
    {
      name: "The Realist",
      color: "bg-purple-400",
    },
    {
      name: "The Pragmatist",
      color: "bg-green-400",
    },
    {
      name: "The Skeptic",
      color: "bg-red-400",
    },
  ];

  const debateRoom = [
    {
      name: "None",
      color: "bg-zinc-200",
    },
    {
      name: "None",
      color: "bg-zinc-200",
    },
    {
      name: "None",
      color: "bg-zinc-200",
    },
    {
      name: "None",
      color: "bg-zinc-200",
    },
  ];

  const selectedAgents = [agents[0], agents[1]];

  // replace 2 first slots with the idealist and the realist
  debateRoom[0] = selectedAgents[0];
  debateRoom[1] = selectedAgents[1];

  const turnPolicies = ["Round-robin", "Random"];
  const numberOfTurns = [5, 10, 15, 20, 25];

  return (
    <div className="bg-zinc-100 h-screen min-h-screen">
      {/* Left panel */}
      <div className="h-full w-1/3 bg-white p-8 flex flex-col gap-8">
        {/* Agent selection */}
        <div>
          <h2 className="font-bold py-2">Agent selection</h2>
          <div className="flex flex-wrap gap-2 p-4 bg-zinc-100 rounded-lg">
            {agents.map((agent) => (
              <AgentOption key={agent.name}>
                <AgentRect color={agent.color} />
                <span>{agent.name}</span>
              </AgentOption>
            ))}
          </div>
        </div>

        {/* Debate settings */}
        <div className="w-full">
          <h2 className="font-bold py-2">Debate settings</h2>
          <div className="flex gap-4">
            {/* Debate room */}
            <div className="w-40 aspect-square rounded-2xl border grid  grid-rows-2 grid-cols-2 gap-4 p-4">
              {debateRoom.map((slot, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-blue-200 ${slot.color}`}
                />
              ))}
            </div>

            {/* Adjustments */}
            <div className="space-y-2">
              <AdjustmentSelection label="Turn policy" options={turnPolicies} />
              <AdjustmentSelection
                label="Number of turns"
                options={numberOfTurns.map((num) => num.toString())}
              />
              <AdjustmentSelection
                label="Debate starter"
                options={agents.map((agent) => agent.name)}
              />
            </div>
          </div>
        </div>

        {/* Debate subject textfield */}
        <div>
          <h2 className="font-bold py-2">Debate subject</h2>
          <Textarea></Textarea>
        </div>

        <Button className="self-start">Start Debate</Button>
      </div>
    </div>
  );
}

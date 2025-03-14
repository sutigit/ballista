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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Select>
    <SelectTrigger className="w-[320px]">
      <span className="opacity-75">{`${label}:`}</span>
      <SelectValue placeholder="" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>{children}</SelectGroup>
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
    <div className="inline-flex items-center bg-white justify-between gap-3 py-3 pl-4 border rounded-full h-11">
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

  const selectedAgents = [agents[0], agents[1], agents[3], agents[3]];

  // replace 2 first slots with the idealist and the realist
  debateRoom[0] = selectedAgents[0];
  debateRoom[1] = selectedAgents[1];
  debateRoom[2] = selectedAgents[2];
  debateRoom[3] = selectedAgents[3];

  const turnPolicies = ["Round-robin", "Random"];
  const numberOfTurns = [5, 10, 15, 20, 25];

  const turn = 0;

  return (
    <div className="bg-zinc-100 h-screen min-h-screen">
      {/* Left panel */}
      <div className="h-full w-1/3 bg-white p-8 flex flex-col gap-8">
        {/* Agent selection */}
        <div>
          <h2 className="font-medium py-2">Agent selection</h2>
          <div className="flex flex-wrap gap-2 p-4 bg-zinc-100 rounded-lg text-sm">
            {agents.map((agent) => (
              <AgentOption key={agent.name}>
                <AgentRect color={agent.color} />
                <span>{agent.name}</span>
              </AgentOption>
            ))}
          </div>
        </div>

        {/* Debate settings */}
        <div>
          <h2 className="font-medium py-2">Debate settings</h2>
          <div className="flex gap-5">
            {/* Debate room */}
            <div className="w-40 aspect-square rounded-2xl border grid  grid-rows-2 grid-cols-2 gap-5 p-5">
              {debateRoom.map((slot, index) => (
                <div
                  key={index}
                  className={`rounded-lg outline-zinc-600 outline-offset-2 ${
                    slot.color
                  } ${index === turn && "outline"}`}
                />
              ))}
            </div>

            {/* Adjustments */}
            <div className="space-y-2">
              <AdjustmentSelection label="Turn policy">
                {turnPolicies.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </AdjustmentSelection>
              <AdjustmentSelection label="Number of turns">
                {numberOfTurns.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </AdjustmentSelection>
              <AdjustmentSelection label="Debate starter">
                {selectedAgents.map((agent, index) => (
                  <SelectItem
                    key={agent.name + index.toString()}
                    value={agent.name.toLowerCase()}
                  >
                    <div className="flex items-center gap-2 h-6 py-1">
                      <AgentRect color={agent.color} />
                      {agent.name}
                      <span className="opacity-50">{`(Slot ${
                        index + 1
                      })`}</span>
                    </div>
                  </SelectItem>
                ))}
              </AdjustmentSelection>
            </div>
          </div>
        </div>

        {/* Debate subject textfield */}
        <div>
          <h2 className="font-medium py-2">Debate subject</h2>
          <Textarea></Textarea>
        </div>

        <Button className="self-start">Start Debate</Button>
      </div>
    </div>
  );
}

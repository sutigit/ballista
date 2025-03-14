'use client';

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { useRouter } from "next/navigation";

export function Modal({ label, children }: { label: string, children: React.ReactNode }) {

    const router = useRouter()

    const closeModal = () => {
        router.back()
    }

    return (
        <div className="absolute left-0 top-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] flex justify-center items-center">
            <div className="bg-white rounded-2xl w-2/3 h-4/5 flex flex-col min-w-96 min-h-96 p-10 pb-12 relative">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl">{label}</h2>
                    <Button variant="outline" onClick={closeModal}>
                        <XIcon />
                    </Button>
                </div>

                <div className=" overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

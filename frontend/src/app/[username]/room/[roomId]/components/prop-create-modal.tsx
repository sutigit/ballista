'use client';

import { useRouter, usePathname } from "next/navigation";

import { Modal } from "@/components/ui/modal"

const templates = [
    {
        // chat-app:simple template
        url: '/cas',
        name: 'Simple',
    },
]

export default function PropCreateModal() {
    const router = useRouter()
    const pathname = usePathname()

    const handlePropCreate = (url: string) => {
        // get current route and add the url to it
        router.push(`${pathname}/${url}`)
    }

    return (
        <Modal label="Choose template">
            <div className="flex flex-col gap-10">
                <div>
                    <h3 className="mb-4">Chat Apps</h3>
                    <div className="flex gap-8">
                        {templates.map((template, index) => (
                            <div key={index} className="flex flex-col gap-2 cursor-pointer" onClick={() => handlePropCreate(template.url)}>
                                <div className="w-48 h-48 bg-gray-300 rounded-lg"></div>
                                <p className="text-sm">{template.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

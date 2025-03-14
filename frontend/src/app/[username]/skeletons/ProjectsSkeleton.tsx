import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsSkeleton() {
    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-4">

                {/* SEARCH */}
                <Skeleton className="w-80 h-9 rounded" />

                {/* CREATE NEW PROJECT BUTTON */}
                <Skeleton className="w-40 h-9 rounded-full ml-auto bg-zinc-600" />

            </div>

            {/* PROJECT TABLE */}
            <div className="rounded-xl overflow-hidden">
                <Skeleton className="w-full h-60" />
            </div>


            <div className="flex items-center justify-end space-x-2 py-4">
                {/* ADVANCED PAGINATION */}
                <Skeleton className="w-96 h-9" />
            </div>
        </div>
    )
}

'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { useToast } from "@/components/hooks/use-toast"

import { logout } from '@/lib/actions/auth';


export default function NavBar({
    loggedIn,
    username,
    userId
}: {
    loggedIn: boolean,
    username: string | null | undefined,
    userId: string | null | undefined
}) {

    // check if path inclides word editor
    const path = usePathname();
    
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();
    
    useEffect(() => {
        setLoading(false);
    }, [loggedIn]);
    
    const handleLogout = async () => {
        setLoading(true);
        logout()
            .then((success) => {
                if (success) {
                    redirect('/');
                } else {
                    toast({
                        title: "Oops, something went wrong",
                        description: "Unexpected error occurred while logging out, please try again.",
                    })
                    setLoading(false);
                }
            }).finally(() => {
                setLoading(false);
            })
    }

    // Don't show navbar on editor, preview and live pages
    const isEditorView = path.startsWith(`/${username}/editor`);
    const isPreviewView = path.startsWith(`/${username}/preview`);
    const isLiveView = path.startsWith(`/live`);
    
    if (isEditorView || isPreviewView || isLiveView) return null;

    return (
        <div className='border py-6'>
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">Home</Link>
                {loggedIn ?
                    <div className='flex gap-6 items-center'>
                        <Link href={`/${username}/dashboard`}>Dashboard</Link>
                        <Button disabled={loading} className='rounded-full flex items-center gap-2' onClick={handleLogout}>
                            Logout
                            {loading && <Loading />}
                        </Button>
                    </div>
                    :
                    <Button disabled={loading} className='rounded-full flex items-center gap-2'>
                        <Link href="/login">Login</Link>
                        {loading && <Loading />}
                    </Button>
                }
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loading } from "@/components/ui/loading"

import { login } from "@/lib/actions/auth"
import { redirect } from "next/navigation"


const LoginSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required.")
        .min(3, "Username must be at least 3 characters.")
        .max(25, "Username must be at most 25 characters."),
    password: z
        .string()
        .min(1, "Password is required.")
        .min(6, "Password must be at least 6 characters.")
        .max(255, "Password must be at most 255 characters."),
})

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof LoginSchema>) {
        setError(null)
        setLoading(true)

        login(data.username, data.password)
            .then((response) => {
                if (!response.success) {
                    setError(response.message)
                    form.reset()
                    return
                }

                redirect(`/${response.username}/dashboard`)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="p-8 border rounded-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error ? <p className="text-red-500">{error}</p> : null}
                    <Button disabled={loading} type="submit" className="rounded-full flex items-center gap-2">
                        Submit
                        {loading && <Loading />}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

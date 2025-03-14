
import { redirect } from "next/navigation";
import LoginForm from "./components/login-form";
import { verifySession } from "@/lib/session/verifySession";

export default async function LoginPage() {

    const session = await verifySession();
    if (session.isAuth) {
        redirect('/');
    }

    return (
        <div className="container mx-auto py-9 flex flex-col items-center gap-4">
            <div className="py-20">
                <LoginForm />
            </div>
        </div>
    );
}

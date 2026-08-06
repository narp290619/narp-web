import LoginForm from "@/components/auth/LoginForm";
import LoginHero from "@/components/auth/LoginHero";

export default function LoginPage() {

    return (

        <main className="flex min-h-screen bg-white">

            <LoginHero />

            <LoginForm />

        </main>

    );

}
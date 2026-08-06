"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Eye, EyeOff } from "lucide-react";

import { login } from "@/lib/services/auth/auth.service";

export default function LoginForm() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            setLoading(true);

            setError("");

            await login(email, password);

            router.push("/");

        } catch {

            setError("Invalid email or password.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="flex w-full items-center justify-center lg:w-1/2">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 p-10"
            >

                <div>

                    <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">

                        NARP ADMIN

                    </p>

                    <h1 className="mt-2 text-4xl font-bold">

                        Welcome Back

                    </h1>

                    <p className="mt-2 text-slate-500">

                        Sign in to manage the NARP platform.

                    </p>

                </div>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-orange-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Password"
                        className="w-full rounded-2xl border border-slate-300 px-5 py-4 pr-14 outline-none focus:border-orange-500"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>

                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    disabled={loading}
                    className="w-full rounded-2xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                    {loading
                        ? "Signing In..."
                        : "Sign In"}
                </button>

                <button
                    type="button"
                    className="w-full text-center text-sm text-slate-500 hover:text-orange-500"
                >
                    Forgot Password?
                </button>

            </form>

        </div>

    );

}
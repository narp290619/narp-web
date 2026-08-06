import { getAllSkills } from "@/repositories/skill.repository";

export default async function TestPage() {

    const skills = await getAllSkills();

    return (

        <main className="p-10">

            <h1 className="text-4xl font-bold">

                Firebase Test

            </h1>

            <pre className="mt-10">

                {JSON.stringify(skills, null, 2)}

            </pre>

        </main>

    );

}
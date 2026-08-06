import { Card } from "@/components/ui/card";


interface Props {
    icon: React.ElementType;
    title: string;
    description: string;
}

export default function AICard({
    icon: Icon,
    title,
    description,
}: Props) {
    return (
        <Card className="p-7">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">

                <Icon
                    className="h-7 w-7 text-orange-500"
                />

            </div>

            <h3 className="text-xl font-bold">

                {title}

            </h3>

            <p className="mt-3 text-slate-600 leading-7">

                {description}

            </p>

        </Card>
    );
}
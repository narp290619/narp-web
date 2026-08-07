type Props = {
    title: string;
    children: React.ReactNode;
    type?: "info" | "success" | "warning";
};

export default function LegalNotice({
    title,
    children,
    type = "info",
}: Props) {

    const styles = {
        info: {
            container: "bg-blue-50 border-l-4 border-blue-500",
            title: "text-blue-700",
        },
        success: {
            container: "bg-green-50 border-l-4 border-green-500",
            title: "text-green-700",
        },
        warning: {
            container: "bg-yellow-50 border-l-4 border-yellow-500",
            title: "text-yellow-700",
        },
    };

    const style = styles[type];

    return (

        <div className={`mt-6 rounded-xl p-5 ${style.container}`}>

            <h3 className={`font-semibold ${style.title}`}>
                {title}
            </h3>

            <div className="mt-2 text-gray-700">
                {children}
            </div>

        </div>

    );

}
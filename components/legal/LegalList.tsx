type LegalListProps = {
    items: string[];
    ordered?: boolean;
};

export default function LegalList({
    items,
    ordered = false,
}: LegalListProps) {

    const List = ordered ? "ol" : "ul";

    return (

        <List
            className={`
                mt-4
                space-y-3
                pl-6
                leading-8
                text-gray-700
                ${ordered
                    ? "list-decimal"
                    : "list-disc"
                }
            `}
        >

            {items.map((item, index) => (

                <li key={index}>

                    {item}

                </li>

            ))}

        </List>

    );

}
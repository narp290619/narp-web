import AISuggestionCard from "./AISuggestionCard";

interface Props {

    recommendations: {

        skill: string;

        match: number;

    }[];

}

export default function AIRanking({

    recommendations,

}: Props) {

    return (

        <div className="grid gap-5">

            {recommendations.map((item) => (

                <AISuggestionCard

                    key={item.skill}

                    skill={item.skill}

                    match={item.match}

                />

            ))}

        </div>

    );

}
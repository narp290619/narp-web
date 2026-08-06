"use client";

import ConversationPlayer from "../shared/ConversationPlayer";


interface Props {

    messages: string[];

}

export default function JourneyAssistant({

    messages,

}: Props) {

    return (

        <div
            className="
                mx-5
                mt-4
                rounded-2xl
                bg-orange-50
                p-4
            "
        >

            <div className="flex gap-3">

                <div className="text-2xl">

                    🤖

                </div>

                <div className="flex-1">

                    <p className="text-xs text-slate-500">

                        NARP AI Assistant

                    </p>

                    <ConversationPlayer

                        messages={messages}

                    />

                </div>

            </div>

        </div>

    );

}
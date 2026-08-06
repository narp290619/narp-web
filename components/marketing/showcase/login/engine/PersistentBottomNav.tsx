"use client";

import {

    House,

    Search,

    Calendar,

    MessageCircle,

    User,

} from "lucide-react";

const icons=[

House,

Search,

Calendar,

MessageCircle,

User,

];

export default function PersistentBottomNav(){

return(

<div
className="
absolute
bottom-0
left-0
right-0
border-t
bg-white/90
backdrop-blur
">

<div
className="
flex
justify-around
py-4
">

{icons.map((Icon,index)=>(

<div
key={index}
className={`
${index===0
?"text-orange-500"
:"text-slate-400"}
`}
>

<Icon size={22}/>

</div>

))}

</div>

</div>

);

}
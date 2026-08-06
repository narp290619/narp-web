"use client";

import { BrainCircuit } from "lucide-react";

import { motion } from "framer-motion";
import ThinkingDots from "../../ui/ThinkingDots";



export default function AIScene(){

    return(

<div className="flex h-full flex-col bg-white p-6">

<div className="flex items-center gap-3">

<div className="rounded-2xl bg-orange-100 p-3">

<BrainCircuit className="text-orange-500"/>

</div>

<div>

<h2 className="font-bold text-xl">

NARP AI Assistant

</h2>

<p className="text-slate-500 text-sm">

Finding the perfect Builder

</p>

</div>

</div>

<div className="mt-10 rounded-3xl bg-orange-50 p-6">

<div className="text-center">

<div className="text-7xl">

🤖

</div>

<h3 className="mt-4 font-bold text-xl">

Analyzing...

</h3>

<p className="mt-2 text-slate-500">

Checking skills

distance

ratings

availability

and reviews

</p>

</div>

</div>

<div className="mt-8 flex justify-center">

<ThinkingDots/>

</div>

<div className="mt-auto">

<div className="flex justify-between">

<span>

AI Confidence

</span>

<span>

98%

</span>

</div>

<div className="mt-3 h-3 rounded-full bg-slate-200">

<motion.div

initial={{width:0}}

animate={{width:"98%"}}

transition={{duration:2}}

className="h-full rounded-full bg-orange-500"

/>

</div>

</div>

</div>

);

}
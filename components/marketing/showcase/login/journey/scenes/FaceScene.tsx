"use client";

import { ShieldCheck } from "lucide-react";

import { motion } from "framer-motion";
import ScanFrame from "../../ui/ScanFrame";


export default function FaceScene(){

return(

<div className="flex h-full flex-col bg-white p-6">

<div className="flex items-center gap-3">

<div className="rounded-2xl bg-green-100 p-3">

<ShieldCheck className="text-green-600"/>

</div>

<div>

<h2 className="text-xl font-bold">

Face Verification

</h2>

<p className="text-sm text-slate-500">

Protecting clients and freelancers

</p>

</div>

</div>

<div className="mt-8">

<ScanFrame/>

</div>

<div className="mt-8 rounded-2xl bg-green-50 p-5">

<div className="flex justify-between">

<span>

Identity Match

</span>

<span className="font-bold">

100%

</span>

</div>

<div className="mt-3 h-3 rounded-full bg-green-100">

<motion.div

initial={{width:0}}

animate={{width:"100%"}}

transition={{duration:2}}

className="h-full rounded-full bg-green-500"

/>

</div>

</div>

<div className="mt-auto text-center">

<div className="text-5xl">

✅

</div>

<p className="mt-3 font-semibold">

Verified Successfully

</p>

</div>

</div>

);

}
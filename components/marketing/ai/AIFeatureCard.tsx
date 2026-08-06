import { motion } from "framer-motion";

interface Props {
  icon: string;
  title: string;
  description: string;
}

export default function AIFeatureCard({
  icon,
  title,
  description,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>
    </motion.div>
  );
}
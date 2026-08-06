import Image from "next/image";

export default function PhilippinesMap() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Image
        src="/images/map/philippines.png"
        alt="Philippines Map"
        width={900}
        height={900}
        className="
          opacity-15
          object-contain
          select-none
        "
        priority
      />
    </div>
  );
}
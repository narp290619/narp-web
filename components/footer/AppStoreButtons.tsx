import Image from "next/image";
import Link from "next/link";

const GOOGLE_PLAY_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "";

const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL || "";

function StoreButton({
  href,
  image,
  alt,
}: {
  href: string;
  image: string;
  alt: string;
}) {
  const comingSoon = href.trim() === "";

  const content = (
    <div className="relative">
      <Image
        src={image}
        alt={alt}
        width={170}
        height={55}
        className={`h-auto w-40 transition ${
          comingSoon ? "opacity-60" : "hover:scale-105"
        }`}
      />

      {comingSoon && (
        <span
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            rounded-lg
            bg-black/55
            text-xs
            font-semibold
            tracking-wide
            text-white
          "
        >
          Coming Soon
        </span>
      )}
    </div>
  );

  if (comingSoon) {
    return content;
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </Link>
  );
}

export default function AppStoreButtons() {
  return (
    <div className="space-y-4">
      <StoreButton
        href={GOOGLE_PLAY_URL}
        image="/images/store/google-play.svg"
        alt="Get it on Google Play"
      />

      <StoreButton
        href={APP_STORE_URL}
        image="/images/store/app-store.svg"
        alt="Download on the App Store"
      />
    </div>
  );
}
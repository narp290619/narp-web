// export const footerColumns = [
//     {
//         title: "Company",
//         links: [
//             {
//                 label: "About",
//                 href: "/about",
//             },
//             {
//                 label: "Contact",
//                 href: "/contact",
//             },
//             {
//                 label: "How It Works",
//                 href: "/how-narp-works",
//             },
//         ],
//     },

//     {
//         title: "Services",
//         links: [
//             {
//                 label: "Browse Services",
//                 href: "/services",
//             },
//         ],
//     },

//     {
//         title: "Legal",
//         links: [
//             {
//                 label: "Legal Center",
//                 href: "/legal",
//             },
//             {
//                 label: "Privacy Policy",
//                 href: "/legal/privacy",
//             },
//             {
//                 label: "Terms & Conditions",
//                 href: "/legal/terms",
//             },
//         ],
//     },
// ];

import { FooterColumnProps } from "./FooterColumn";

export const footerColumns: FooterColumnProps[] = [
  {
    title: "About",
    links: [
      {
        label: "About NARP",
        href: "/about",
      },
      {
        label: "Careers",
        href: "/careers",
      },
      {
        label: "Blog",
        href: "/blog",
      },
    ],
  },

  {
    title: "Platform",
    links: [
      {
        label: "Services",
        href: "/services",
      },
      {
        label: "Find Freelancers",
        href: "/freelancers",
      },
      {
        label: "Become a Freelancer",
        href: "/become-a-freelancer",
      },
    ],
  },

  {
    title: "Support",
    links: [
      {
        label: "Help Center",
        href: "/help",
      },
      {
        label: "Contact",
        href: "/contact",
      },
      {
        label: "FAQs",
        href: "/faq",
      },
    ],
  },

  {
    title: "Legal",
    links: [
      {
        label: "Legal Center",
        href: "/legal",
      },
      {
        label: "Privacy Policy",
        href: "/legal/privacy",
      },
      {
        label: "Terms of Service",
        href: "/legal/terms",
      },
    ],
  },
];
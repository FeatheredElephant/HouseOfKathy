export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", key: "" },
  { href: "/properties", label: "Our Listings", key: "properties" },
  { href: "/about", label: "About", key: "about" },
  { href: "/blog", label: "Blog", key: "blog" },
  { href: "/fairHousing", label: "Fair Housing", key: "fairHousing" },
  { href: "/contact", label: "Contact", key: "contact" },
];

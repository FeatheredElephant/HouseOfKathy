export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export interface Dropdown {
  label: string;
  key: string;
  links: NavLink[];
}

export type NavItem = NavLink | Dropdown;

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home", key: "" },
  { href: "/properties", label: "Our Listings", key: "properties" },
  { href: "/about", label: "About", key: "about" },
  //{ href: "/blog", label: "Blog", key: "blog" },
  { label: "Policies", key: "policies", 
    links: [
      {
        href: "/policies/fairHousing",
        label: "Fair Housing",
        key: "fairhousing"
      },
      {
        href: "/policies/sop",
        label: "Standard Operating Procedure",
        key: "sop"
      }
    ] },
  { href: "/contact", label: "Contact", key: "contact" },
];

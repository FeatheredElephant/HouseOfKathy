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
        href: "/policies/sop-buyer",
        label: "Buyer Operating Procedure",
        key: "sop-buyer"
      },
      {
        href: "/policies/sop-seller",
        label: "Seller Operating Procedure",
        key: "sop-seller"
      },
      {
        href: "/policies/compensation",
        label: "Compensation Policy",
        key: "compensation"
      }
    ] },
  { href: "/contact", label: "Contact", key: "contact" },
];

import React from "react";
import Link from "next/link";

interface LinkCardProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  marginTop?: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ title, href, icon, children, marginTop = "1rem" }) => {
  return (
    <Link
      href={href}
      style={{ marginTop: marginTop }}
      className="nextra-card nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900"
    >
      <div className="flex items-start space-x-3">
        
        <div>
          <h3 className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 nx-flex nx-items-center">
            {icon && <span className="text-xl">{icon}</span>}
            {title}
            <span>&#x2192;</span>
          </h3>
          {children && <p className="text-sm opacity-80">{children}</p>}
        </div>
      </div>
    </Link>
  );
};

export default LinkCard;
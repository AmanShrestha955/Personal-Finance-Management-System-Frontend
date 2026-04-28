import { DollarSign, Mail } from "lucide-react";
import Image from "next/image";

interface FamilyMemberCardProps {
  memberImage: string;
  name: string;
  role: "Owner" | "Member" | "Child";
  email: string;
  monthlyBudget: string;
}

const roleBadgeStyles: Record<FamilyMemberCardProps["role"], string> = {
  Owner: "bg-tag-1 text-primary-700",
  Member: "bg-card-200 text-card-800",
  Child: "bg-tag-2 text-secondary-700",
};

export function FamilyMemberCard({
  memberImage,
  name,
  role,
  email,
  monthlyBudget,
}: FamilyMemberCardProps) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-card-200/50 flex-1 min-w-0 shadow-effect-1">
      {/* Header: avatar + name + badge */}
      <div className="flex items-start gap-4">
        <Image
          width={40}
          height={40}
          src={memberImage.length > 0 ? memberImage : "/default_user.jpg"}
          alt="Member"
          unoptimized
          className="rounded-full object-cover object-center w-10 h-10 shrink-0"
        />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-card-800 font-bold text-lg leading-7 truncate">
            {name}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium leading-4 w-fit ${roleBadgeStyles[role]}`}
          >
            {role}
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div className="flex flex-col gap-2">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-card-600 shrink-0" />
          <span className="text-card-600 text-sm leading-5 truncate">
            {email}
          </span>
        </div>

        {/* Monthly budget */}
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-card-600 shrink-0" />
          <span className="text-sm leading-5">
            <span className="text-card-600 font-normal">Monthly: </span>
            <span className="text-card-800 font-semibold">{monthlyBudget}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

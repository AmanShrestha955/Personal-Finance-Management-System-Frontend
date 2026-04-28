import { FamilyMemberCard } from "./FamilyMemberCard";
import { Family, FamilyMember } from "@/utils/familyApi";

interface FamilyMembersProps {
  family: Family;
  currentUserId: string;
}

export function FamilyMembers({ family, currentUserId }: FamilyMembersProps) {
  return (
    <div className="bg-card-100 rounded-2xl shadow-effect-2 p-6 pb-6">
      <h2 className="text-card-900 font-bold text-heading2 leading-7 mb-6">
        {family.name} ({family.members.length}{" "}
        {family.members.length === 1 ? "member" : "members"})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {family.members.map((member: FamilyMember) => {
          const isOwner = member.user?._id === family.owner._id;
          const isYou = member.user?._id === currentUserId;

          return (
            <FamilyMemberCard
              key={member._id}
              memberImage={
                member.user?.photo
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${member.user?.photo}`
                  : "/default_user.jpg"
              }
              name={
                isYou
                  ? `${member.user?.name} (You)`
                  : (member.user?.name ?? member.email)
              }
              role={isOwner ? "Owner" : "Member"}
              email={member.email}
              monthlyBudget="—"
            />
          );
        })}
      </div>
    </div>
  );
}

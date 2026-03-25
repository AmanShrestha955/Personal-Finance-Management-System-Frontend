import { FamilyMemberCard } from "./FamilyMemberCard";

const members = [
  {
    memberImage: "/default_user.jpg",
    name: "John Doe",
    role: "Admin" as const,
    email: "john.doe@email.com",
    monthlyBudget: "Rs. 15,000",
  },
  {
    memberImage: "/default_user.jpg",
    name: "Jane Doe",
    role: "Member" as const,
    email: "jane.doe@email.com",
    monthlyBudget: "Rs. 12,500",
  },
  {
    memberImage: "/default_user.jpg",
    name: "Alex Doe",
    role: "Child" as const,
    email: "alex.doe@email.com",
    monthlyBudget: "Rs. 4,900",
  },
];

export function FamilyMembers() {
  return (
    <div className="bg-white rounded-2xl shadow-effect-2 p-6 pb-6">
      <h2 className="text-card-900 font-bold text-heading2 leading-7 mb-6">
        Family Members ({members.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <FamilyMemberCard key={member.email} {...member} />
        ))}
      </div>
    </div>
  );
}

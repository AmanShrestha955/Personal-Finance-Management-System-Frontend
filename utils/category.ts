import {
  FoodAndDiningIcon,
  TransportIcon,
  ShoppingIcon,
  BillsAndUtilitiesIcon,
  RentHousingIcon,
  EntertainmentIcon,
  HealthcareIcon,
  PersonalCareIcon,
  SavingsIcon,
  EducationIcon,
  OthersIcon,
} from "@/component/icons/CategoryIcons";
import { Category } from "@/types/type";
const category = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Bills & Utilities",
  "Rent/Housing",
  "Entertainment",
  "Healthcare",
  "Personal Care",
  "Savings",
  "Education",
  "Others",
];
const categoryColors = {
  "Food & Dining": "#FF6B6B",
  Transport: "#4ECDC4",
  Shopping: "#A770EF",
  "Bills & Utilities": "#FFA726",
  "Rent/Housing": "#5C6BC0",
  Entertainment: "#EC407A",
  Healthcare: "#66BB6A",
  "Personal Care": "#FDD835",
  Savings: "#26A69A",
  Education: "#42A5F5",
  Others: "#78909C",
};

const categoryIcons = {
  "Food & Dining": FoodAndDiningIcon,
  Transport: TransportIcon,
  Shopping: ShoppingIcon,
  "Bills & Utilities": BillsAndUtilitiesIcon,
  "Rent/Housing": RentHousingIcon,
  Entertainment: EntertainmentIcon,
  Healthcare: HealthcareIcon,
  "Personal Care": PersonalCareIcon,
  Savings: SavingsIcon,
  Education: EducationIcon,
  Others: OthersIcon,
};
const categoryWithIcon: Array<{ text: Category; icon: React.ComponentType }> = [
  { text: "Food & Dining", icon: FoodAndDiningIcon },
  { text: "Transport", icon: TransportIcon },
  { text: "Shopping", icon: ShoppingIcon },
  { text: "Bills & Utilities", icon: BillsAndUtilitiesIcon },
  { text: "Rent/Housing", icon: RentHousingIcon },
  { text: "Entertainment", icon: EntertainmentIcon },
  { text: "Healthcare", icon: HealthcareIcon },
  { text: "Personal Care", icon: PersonalCareIcon },
  { text: "Savings", icon: SavingsIcon },
  { text: "Education", icon: EducationIcon },
  { text: "Others", icon: OthersIcon },
];
export { category, categoryWithIcon, categoryColors, categoryIcons };

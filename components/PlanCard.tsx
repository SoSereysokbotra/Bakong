// components/PlanCard.tsx
import React from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg p-5 cursor-pointer transition ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 hover:shadow"
      }`}
    >
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <p className="text-2xl font-semibold mt-2">
        {plan.price.toLocaleString()} KHR
      </p>
      <ul className="mt-4 space-y-1 text-gray-600">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-green-500">✓</span> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanCard;

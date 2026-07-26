"use client";

import { EquipmentCard, type CatalogItem, type CardLabels } from "./EquipmentCard";

export function UnitsGrid({
  items,
  labels,
}: {
  items: CatalogItem[];
  labels: CardLabels;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <EquipmentCard key={item.id} item={item} labels={labels} />
      ))}
    </div>
  );
}

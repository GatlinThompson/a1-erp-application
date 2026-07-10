const itemTypes = ["parts", "hardwares", "hardware_kits"] as const;
const componentKeys = {
    parts: "part",
    hardwares: "hardware",
    hardware_kits: "kit",
} as const;
 const componentsInclude: Partial<Record<(typeof itemTypes)[number], { select: { quantity: true; [key: string]: any } }>> = {};

for (const type of itemTypes) {
    const relationKey = componentKeys[type];
    componentsInclude[type] = {
        select: {
            quantity: true,
            [relationKey]: {
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    quantity_on_hand: true,
                },
            },
        },
    };
}

export default componentsInclude;
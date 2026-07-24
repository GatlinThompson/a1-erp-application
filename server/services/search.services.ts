import prisma from "@lib/prisma.js";

const searchService = {
  searchQuery: async (query: string) => {
    if (!query || query.trim() === "") {
      return [];
    }

    const products = await prisma.product.findMany({
      select: {
        sku: true,
        name: true,
        type: true,
      },
      where: {
        OR: [
          {
            sku: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        AND: [
          {
            type: {
              notIn: ["SUB_PART"],
            },
          },
        ],
      },
      orderBy: [{ type: "desc" }, { sku: "asc" }],
      take: 10,
    });
    return products;
  },
};

export default searchService;

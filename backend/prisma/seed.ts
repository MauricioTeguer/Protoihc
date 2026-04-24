import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultUser = {
  email: "demo@expentra.local",
  name: "ExpenTra Demo User",
};

const defaultCategories = [
  { name: "Food & Dining", icon: "utensils", color: "#10B981" },
  { name: "Transportation", icon: "car", color: "#3B82F6" },
  { name: "Shopping", icon: "shopping-bag", color: "#F59E0B" },
  { name: "Entertainment", icon: "film", color: "#8B5CF6" },
  { name: "Bills & Utilities", icon: "receipt", color: "#EC4899" },
  { name: "Healthcare", icon: "heart-pulse", color: "#EF4444" },
  { name: "Education", icon: "graduation-cap", color: "#06B6D4" },
  { name: "Other", icon: "more-horizontal", color: "#6B7280" }
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: defaultUser.email },
    update: {},
    create: defaultUser,
  });

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: category.name,
        },
      },
      update: {
        icon: category.icon,
        color: category.color,
      },
      create: {
        ...category,
        userId: user.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });

import prisma from "@/api/prisma/client";

async function deleteAllData() {
    await prisma.project.deleteMany(); // Delete all rows from the Project table
    await prisma.user.deleteMany(); // Delete all rows from the User table (example)
    console.log("All data deleted!");
}



function main() {
  deleteAllData()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
}

main();
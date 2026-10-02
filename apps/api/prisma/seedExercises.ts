import { PrismaClient } from '@prisma/client';
import { builtInExercises } from './exerciseCatalog';

const prisma = new PrismaClient();

async function main() {
  const existingExercises = await prisma.exercise.findMany({
    where: { created_by: null },
    select: { name: true }
  });
  const existingNames = new Set(existingExercises.map((exercise) => exercise.name));
  const missingExercises = builtInExercises.filter((exercise) => !existingNames.has(exercise.name));

  if (missingExercises.length > 0) {
    await prisma.exercise.createMany({ data: missingExercises });
  }

  console.log(`Built-in exercise catalog ready (${builtInExercises.length} exercises; ${missingExercises.length} added).`);
}

main()
  .catch((error) => {
    console.error('Failed to initialize built-in exercises:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
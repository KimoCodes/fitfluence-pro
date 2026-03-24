import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient, Role } from '@prisma/client';

function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const contents = fs.readFileSync(envPath, 'utf8');

  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error('Usage: npm run admin:promote -- user@example.com');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`No user found for ${email}. Register that account first, then rerun this command.`);
    process.exit(1);
  }

  if (user.role === Role.ADMIN) {
    console.log(`${email} is already an ADMIN.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: Role.ADMIN }
  });

  console.log(`Promoted ${email} to ADMIN.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

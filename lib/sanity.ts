import { createClient } from 'next-sanity';

function normalizeProjectId(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === 'your_project_id') {
    return 'demo';
  }

  return /^[a-z0-9-]+$/.test(trimmed) ? trimmed : 'demo';
}

function normalizeDataset(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === 'your_dataset') {
    return 'production';
  }

  return trimmed;
}

const config = {
  projectId: normalizeProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: normalizeDataset(process.env.NEXT_PUBLIC_SANITY_DATASET),
  apiVersion: '2024-10-01',
  useCdn: false
};

export const sanityReadClient = createClient(config);

export const sanityWriteClient = createClient({
  ...config,
  token: process.env.SANITY_API_TOKEN
});

export function hasSanityWriteAccess() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your_project_id' &&
      process.env.NEXT_PUBLIC_SANITY_DATASET &&
      process.env.SANITY_API_TOKEN &&
      process.env.SANITY_API_TOKEN !== 'your_sanity_token'
  );
}

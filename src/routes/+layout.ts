import posthog from 'posthog-js';
import { browser } from '$app/environment';

export const load = async () => {
  if (browser) {
    posthog.init('phc_bfmQxDhMP7S697xNJB0qEKeOLAvtEOPSRtiQSIaX52J', {
      api_host: 'https://insi.viralmind.ai',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_exceptions: true
    });
  }
  return;
};

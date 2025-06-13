import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // Fetch the latest.json file from GitHub
    const response = await fetch(
      'https://github.com/viralmind-ai/desktop/releases/latest/download/latest.json'
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const version = data.version;

    // Construct download URLs based on version
    const baseUrl = 'https://github.com/viralmind-ai/desktop/releases/latest/download/';

    // Return the modified data with direct download URLs
    return json({
      version: version,
      notes: data.notes,
      pub_date: data.pub_date,
      platforms: {
        'darwin-x86_64': {
          url: `${baseUrl}Viralmind.Desktop_${version}_x64.dmg`
        },
        'linux-x86_64': {
          url: `${baseUrl}Viralmind.Desktop_${version}_amd64.deb`
        },
        'windows-x86_64': {
          url: `${baseUrl}Viralmind.Desktop_${version}_x64_en-US.msi`
        },
        'windows-arm64': {
          url: `${baseUrl}Viralmind.Desktop_${version}_arm64_en-US.msi `
        },
        'darwin-aarch64': {
          url: `${baseUrl}Viralmind.Desktop_${version}_aarch64.dmg`
        }
      }
    });
  } catch (error) {
    console.error('Error fetching release data:', error);
    return json({
      version: '0.1.0', // Fallback version
      platforms: {
        'darwin-x86_64': {
          url: 'https://github.com/viralmind-ai/desktop/releases/latest/download/Viralmind.Desktop_0.1.0_x64.dmg'
        },
        'linux-x86_64': {
          url: 'https://github.com/viralmind-ai/desktop/releases/latest/download/Viralmind.Desktop_0.1.0_amd64.deb'
        },
        'windows-x86_64': {
          url: 'https://github.com/viralmind-ai/desktop/releases/latest/download/Viralmind.Desktop_0.1.0_x64_en-US.msi'
        },
        'windows-arm64': {
          url: 'https://github.com/viralmind-ai/desktop/releases/latest/download/Viralmind.Desktop_0.1.0_arm64_en-US.msi'
        },
        'darwin-aarch64': {
          url: 'https://github.com/viralmind-ai/desktop/releases/latest/download/Viralmind.Desktop_0.1.0_aarch64.dmg'
        }
      }
    });
  }
};

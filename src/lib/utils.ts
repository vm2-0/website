export async function hashString(input: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

export async function findFastestRegion(): Promise<string> {
  const endpoints = [
    'https://ws-broker-service.us-west-2.amazonaws.com/ping',
    'https://ws-broker-service.us-east-1.amazonaws.com/ping',
    'https://ws-broker-service.eu-central-1.amazonaws.com/ping',
    'https://ws-broker-service.ap-southeast-1.amazonaws.com/ping'
  ];

  const getRegionFromUrl = (url: string): string => {
    const match = url.match(/ws-broker-service\.([\w-]+)\.amazonaws/);
    return match ? match[1] : '';
  };

  const pingEndpoint = async (
    url: string
  ): Promise<{
    url: string;
    responseTime: number;
    region: string;
  }> => {
    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      return {
        url,
        responseTime,
        region: getRegionFromUrl(url)
      };
    } catch (error) {
      // In case of failure, return a very high response time
      // so this endpoint won't be selected as the fastest
      return {
        url,
        responseTime: Number.MAX_SAFE_INTEGER,
        region: getRegionFromUrl(url)
      };
    }
  };

  try {
    // Ping all endpoints concurrently
    const results = await Promise.all(endpoints.map((url) => pingEndpoint(url)));

    // Find the endpoint with the lowest response time
    const fastestEndpoint = results.reduce((prev, current) =>
      prev.responseTime < current.responseTime ? prev : current
    );

    return fastestEndpoint.region;
  } catch (error) {
    throw new Error('Failed to determine fastest region: ' + (error as Error).message);
  }
}


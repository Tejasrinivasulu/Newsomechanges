import { ClimateData } from '../components/DataActions/types';

export function generateShareableLink(data: ClimateData[], region: string, year: number): string {
  // Create a base URL for sharing
  const baseUrl = window.location.origin;
  
  // Create URL parameters
  const params = new URLSearchParams({
    region,
    year: year.toString(),
    data: btoa(JSON.stringify(data)) // Encode data as base64
  });

  return `${baseUrl}?${params.toString()}`;
}

export function parseSharedLink(): { region: string; year: number; data: ClimateData[] } | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');
    const year = params.get('year');
    const encodedData = params.get('data');

    if (!region || !year || !encodedData) {
      return null;
    }

    const data = JSON.parse(atob(encodedData));

    return {
      region,
      year: parseInt(year),
      data
    };
  } catch (error) {
    console.error('Error parsing shared link:', error);
    return null;
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function shareViaEmail(data: ClimateData[], region: string, year: number) {
  const subject = `Climate Analysis for ${region} - Year ${year}`;
  const shareableLink = generateShareableLink(data, region, year);
  
  const body = `
Check out this climate analysis for ${region} (Year ${year}):

Key Metrics:
${data.map(d => `- Year ${d.year}:
  • Temperature: ${d.temperature.toFixed(1)}°C
  • Precipitation: ${d.precipitation.toFixed(1)}%
  • Sea Level Rise: ${d.seaLevel.toFixed(1)}cm
  • Extreme Events: ${d.extremeEvents.toFixed(1)}%`).join('\n')}

View the full analysis here: ${shareableLink}
`;

  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

export function shareViaWhatsApp(data: ClimateData[], region: string, year: number) {
  const shareableLink = generateShareableLink(data, region, year);
  const message = `Check out this climate analysis for ${region} (Year ${year}): ${shareableLink}`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
}

export function shareViaTwitter(data: ClimateData[], region: string, year: number) {
  const shareableLink = generateShareableLink(data, region, year);
  const message = `Exploring climate predictions for ${region} up to ${year}. Check out the analysis: ${shareableLink}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
  window.open(twitterLink, '_blank');
}
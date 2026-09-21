import { SASHIDO_FILE_URL } from '@env';

const getImageUrl = ({
  fileName,
  url,
  height,
  width
}: {
  fileName?: string;
  url?: string;
  height?: number;
  width?: number;
}) => {
  if (url) {
    return url;
  }
  if (!fileName) return '';
  const baseUrl = `${SASHIDO_FILE_URL}${fileName}`;
  const params = new URLSearchParams();

  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (width && height) params.set('crop', 'true');

  const hasParams = Array.from(params.keys()).length > 0;

  return hasParams ? `${baseUrl}?${params.toString()}` : baseUrl;
};

export { getImageUrl };

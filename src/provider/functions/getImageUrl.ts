const getImageUrl = ({
  fileName,
  height,
  width
}: {
  fileName: string;
  height?: number;
  width?: number;
}) => {
  if (!fileName) return '';
  const baseUrl = `${process.env.SASHIDO_FILE_URL}${fileName}`;
  const params = new URLSearchParams();

  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (width && height) params.set('crop', 'true');

  const hasParams = Array.from(params.keys()).length > 0;

  return hasParams ? `${baseUrl}?${params.toString()}` : baseUrl;
};

export { getImageUrl };

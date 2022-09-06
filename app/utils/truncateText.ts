export const truncateText = (text: string, truncationLength: number = 20) => {
  return text.substring(0, truncationLength) + '...';
};

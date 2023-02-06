import { getCloudinaryUrl } from '~/utils/cloudinary';

type Props = { src: string; title: string; priority: boolean };

function GameImage({ src, title, priority }: Props) {
  const small_src = getCloudinaryUrl(src, 'small');
  const large_src = getCloudinaryUrl(src, 'large');

  return (
    <img
      src={large_src}
      srcSet={`${small_src} 360w, ${large_src} 640w`}
      alt={title}
      className="rounded-md"
      width={360}
      height={170}
      // @ts-ignore
      fetchpriority={priority ? 'high' : 'low'}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

export default GameImage;

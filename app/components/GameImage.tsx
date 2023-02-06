const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dbpm7bjks/image/fetch';
const CLOUDINARY_LARGE_URL = `${CLOUDINARY_BASE_URL}/w_360,h_167,f_auto,q_auto/`;
const CLOUDINARY_SMALL_URL = `${CLOUDINARY_BASE_URL}/w_387,h_180,f_auto,q_auto/`;

type Props = { src: string; title: string; priority: boolean };

function GameImage({ src, title, priority }: Props) {
  const full_src = `${CLOUDINARY_LARGE_URL}${src}`;

  return (
    <img
      src={full_src}
      srcSet={`${CLOUDINARY_SMALL_URL}${src} 387w, ${full_src} 360w`}
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

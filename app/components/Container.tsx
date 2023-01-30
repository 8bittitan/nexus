import type { PropsWithChildren } from 'react';

type Props = {
  classes?: string;
};

const Container = ({ children, classes = '' }: PropsWithChildren<Props>) => (
  <div className={'container mx-auto '.concat(classes)}>{children}</div>
);

export default Container;

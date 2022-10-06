import Card from '@components/card/card.component';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';

type Props = { href: string; highlight?: boolean };

const CardLink = ({ href, highlight, children }: PropsWithChildren<Props>) => (
  <NextLink href={href} passHref>
    <Card
      as="a"
      h="full"
      borderColor={highlight ? 'blue.300' : 'transparent'}
      borderStyle="solid"
      borderWidth="2px"
      transition="border"
      transitionDuration="400ms"
      _hover={{ borderColor: 'whiteAlpha.300' }}
    >
      {children}
    </Card>
  </NextLink>
);

export default CardLink;

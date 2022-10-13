import { Box, Heading, HStack, IconButton, Spacer } from '@chakra-ui/react';
import { faEllipsisV } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { PropsWithChildren, ReactNode } from 'react';
import { useIntl } from 'react-intl';

interface Props {
  heading?: string;
  quickAction?: ReactNode;
  moreOptions?: ReactNode;
}

const PageSection = ({ heading, children, quickAction, moreOptions }: PropsWithChildren<Props>) => {
  const intl = useIntl();

  return (
    <Box as="section" mb="6">
      <HStack mb="4">
        {heading && <Heading as="h3">{heading}</Heading>}
        <Spacer />
        {quickAction && quickAction}
        {moreOptions && (
          <IconButton
            aria-label={intl.formatMessage({ id: 'MORE_OPTIONS' })}
            icon={<Icon icon={faEllipsisV} />}
          />
        )}
      </HStack>
      {children}
    </Box>
  );
};

export default PageSection;

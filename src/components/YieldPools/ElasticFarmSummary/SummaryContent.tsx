import { Trans } from '@lingui/macro'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import useTheme from 'hooks/useTheme'
import { ExternalLink } from 'theme'

const TextContainer = styled.ul`
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  margin: 0;
  padding-left: 24px;
  padding-right: 8px;
  width: 100%;
  row-gap: 8px;

  margin-block-start: 0;
  margin-block-end: 0;

  margin-inline-start: 0;
  margin-inline-end: 0;

  list-style-type: disc;
  list-style-position: outside;

  color: ${({ theme }) => theme.subText};

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`

const HighlightedText = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`

type Props = {
  isOpen: boolean
}

const SummaryContent: React.FC<Props> = ({ isOpen }) => {
  const theme = useTheme()
  return (
    <>
      <Flex
        sx={{
          width: '100%',
          flexDirection: 'column',
          rowGap: '12px',
          maxHeight: isOpen ? '1000px' : '0',
          transition: 'max-height 150ms, margin 150ms',
          overflow: 'hidden',
          marginTop: isOpen ? '12px' : '0px',
        }}
      >
        <Text fontSize={14} fontWeight={500} color={theme.text}>
          <Trans>Farming Mechanism 1 - Active Liquidity Time</Trans>
        </Text>
        <TextContainer>
          <li>
            <Trans>
              Farms using this mechanism rely on the <HighlightedText>total time</HighlightedText> your liquidity
              position is <HighlightedText>active</HighlightedText> (i.e. in range) in the pool.
            </Trans>
          </li>
          <li>
            <Trans>
              Once you stake your liquidity position into a farm, your farming rewards are calculated based on the time
              your liquidity position is currently <HighlightedText>active</HighlightedText> and supporting the{' '}
              <HighlightedText>current market price</HighlightedText> of the pool.
            </Trans>
          </li>
          <li>
            <Trans>
              If your liquidity position goes out of range (i.e. becomes inactive), you will{' '}
              <HighlightedText>stop</HighlightedText> accumulating farming rewards. You have 2 options:
            </Trans>

            <TextContainer style={{ marginTop: '8px' }}>
              <li>
                <Trans>
                  <HighlightedText>Option 1</HighlightedText>: Wait for the current market price of the pool to come
                  back in your price range (i.e. for your liquidity position to become active again).
                </Trans>
              </li>

              <li>
                <Trans>
                  <HighlightedText>Option 2</HighlightedText>: Remove your liquidity position from the pool, create a
                  new liquidity position with an active price range, and stake in the farm again.
                </Trans>
              </li>
            </TextContainer>
          </li>
          <li>
            <Trans>You will accumulate farming rewards as long as your liquidity position is active.</Trans>
          </li>
        </TextContainer>
      </Flex>

      <Flex
        sx={{
          width: '100%',
          flexDirection: 'column',
          rowGap: '12px',
          maxHeight: isOpen ? '1000px' : '0',
          transition: 'max-height 150ms, margin 150ms',
          overflow: 'hidden',
          marginTop: isOpen ? '12px' : '0px',
        }}
      >
        <Text fontSize={14} fontWeight={500} color={theme.text}>
          <Trans>Farming Mechanism 2 - Active Liquidity Time & Target Volume</Trans>
        </Text>
        <TextContainer>
          <li>
            <Trans>Farms setup using this mechanism rely on 2 factors:</Trans>

            <TextContainer style={{ marginTop: '8px' }}>
              <li>
                <Trans>
                  The <HighlightedText>total time</HighlightedText> your liquidity position is active (aka in range) in
                  the pool.
                </Trans>
              </li>
              <li>
                <Trans>
                  The <HighlightedText>trade volume</HighlightedText> supported by your liquidity position.
                </Trans>
              </li>
            </TextContainer>
          </li>
          <li>
            <Trans>
              If the <HighlightedText>Target Volume</HighlightedText> column for a farm displays a{' '}
              <HighlightedText>progress bar</HighlightedText>, the farm is setup with this 2nd mechanism.
            </Trans>
          </li>
          <li>
            <Trans>
              Your liquidity position needs to achieve the <HighlightedText>required target volume</HighlightedText>{' '}
              (represented by a progress bar). You will accumulate farming rewards even if your liquidity position
              hasn&apos;t hit the required Target Volume. But as soon as your position hits the required Target Volume
              (i.e. progress bar is 100%), from thereafter, you will earn 100% of the rewards for that liquidity
              position.
            </Trans>
          </li>
          <li>
            <Trans>The more trading volume your position supports, the more farming rewards you will earn.</Trans>
          </li>
          <li>
            <Trans>
              If your liquidity position goes out of range (i.e. becomes inactive), you will{' '}
              <HighlightedText>stop</HighlightedText> accumulating farming rewards. You have 2 options:
            </Trans>

            <TextContainer style={{ marginTop: '8px' }}>
              <li>
                <Trans>
                  <HighlightedText>Option 1:</HighlightedText> Wait for the current market price of the pool to come
                  back in your price range (i.e. for your liquidity position to become active again)
                </Trans>
              </li>
              <li>
                <Trans>
                  <HighlightedText>Option 2:</HighlightedText> Remove your liquidity position from the pool, create a
                  new liquidity position with an active price range, and stake in the farm again
                </Trans>
              </li>
            </TextContainer>
          </li>
        </TextContainer>

        <Text
          as="span"
          sx={{
            fontWeight: '400',
            fontSize: '14px',
            lineHeight: '20px',
            color: theme.subText,
            flexShrink: '0',
          }}
        >
          <Trans>
            If you wish to learn more, click{' '}
            <ExternalLink href="https://docs.kyberswap.com/guides/farming-mechanisms">here ↗</ExternalLink>
          </Trans>
        </Text>
      </Flex>
    </>
  )
}

export default SummaryContent

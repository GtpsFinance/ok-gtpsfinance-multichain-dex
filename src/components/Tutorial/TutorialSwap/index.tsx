import { Trans } from '@lingui/macro'
import React, { CSSProperties, memo, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserView } from 'react-device-detect'
import { ChevronUp } from 'react-feather'
import { Flex } from 'rebass'
import styled, { createGlobalStyle } from 'styled-components'
import { CardinalOrientation, Step, Walktour, WalktourLogic } from 'walktour'

import WelcomeImage from 'assets/images/tutorial_swap/welcome.png'
import { ButtonOutlined, ButtonPrimary } from 'components/Button'
import { ToggleItemType } from 'components/Collapse'
import { TutorialType, getTutorialVideoId } from 'components/Tutorial'
import { SUPPORTED_WALLETS } from 'constants/wallets'
import { useActiveWeb3React } from 'hooks'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import { useTutorialSwapGuide } from 'state/tutorial/hooks'
import { useIsDarkMode } from 'state/user/hooks'
import { ExternalLink } from 'theme'
import { filterTruthy } from 'utils'

import CustomMask from './CustomMask'
import CustomPopup from './CustomPopup'
import TutorialMobile from './TutorialMobile'
import { LIST_TITLE, StepTutorial, TutorialIds } from './constant'

const isMobile = window.innerWidth < 1200 // best resolution for this tutorial

export const Heading = styled.h5`
  color: ${({ theme }) => theme.text};
  user-select: none;
  margin: 5px 0px 10px 0px;
  display: flex;
  align-items: center;
  font-size: 16px;
`

const LayoutWrapper = styled.div`
  color: ${({ theme }) => theme.subText};
  text-align: left;
  font-size: 14px;
`

const Layout = ({ children, title }: { title?: string; children: React.ReactNode }) => {
  return (
    <LayoutWrapper>
      {!isMobile && title && <Heading>{title}</Heading>}
      {children}
    </LayoutWrapper>
  )
}

const ArrowWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text};
  svg {
    transition: all 150ms ease-in-out;
  }
  &[data-expanded='false'] {
    svg {
      transform: rotate(180deg);
    }
  }
`

const NetworkItemWrapper = styled.div`
  background: ${({ theme }) => theme.buttonBlack};
  border-radius: 42px;
  display: flex;
  padding: 10px 15px;
  gap: 10px;
  cursor: pointer;
`

const NetworkWrapper = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 20px;
  padding: 15px;
  gap: 10px;
  display: flex;
  flex-direction: column;
`

const ImageMobile = ({ imageName, marginTop = false }: { imageName: string; marginTop?: boolean }) =>
  isMobile ? (
    <Flex justifyContent={'center'}>
      <img
        style={{ marginTop: marginTop ? 20 : 0, width: '100%', maxWidth: 800 }}
        src={require(`../../../assets/images/tutorial_swap/${imageName}`).default}
        alt={imageName}
      />
    </Flex>
  ) : null

const Desc = styled.p`
  line-height: 20px;
`

const HighlightText = styled.span`
  color: ${({ theme }) => theme.text};
`
function Welcome() {
  return (
    <Layout>
      <img src={WelcomeImage} alt="Gtps.Finance" style={{ maxWidth: '100%', marginTop: 10 }} />
      <Desc>
        <Trans>
          Gtps.Finance leading the world to the next stage of development through low fees and fast transactions. Get
          the the <HighlightText>best swapping experience</HighlightText> on our exchange.
        </Trans>
      </Desc>
      <Desc>
        <Trans>
          Gtps.Finance is an automated market maker (AMM) for fast <HighlightText>lower fees</HighlightText>. You can
          add liquidity to our pools & <HighlightText>for great returns through fees</HighlightText>!
        </Trans>
      </Desc>
      <Desc>
        <Trans>
          Visit our website <HighlightText> www.gtpsfinance.org</HighlightText>
          today.
        </Trans>
      </Desc>
      <Desc>
        <Trans></Trans>
      </Desc>
    </Layout>
  )
}

function ConnectWallet() {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)
  const isDarkMode = useIsDarkMode()
  return (
    <Layout title={LIST_TITLE.CONNECT_WALLET}>
      <Desc>
        <Trans>Connect to a wallet of your choice.</Trans>
      </Desc>
      <ImageMobile imageName="step1.png" />
      <BrowserView>
        <Heading onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          <Trans>Download Wallet</Trans>
          <ArrowWrapper data-expanded={isExpanded}>
            <ChevronUp size={15} onClick={toggleExpand} />
          </ArrowWrapper>
        </Heading>
        {isExpanded && (
          <NetworkWrapper>
            {Object.values(SUPPORTED_WALLETS)
              .filter(e => e.installLink)
              .map(item => (
                <NetworkItemWrapper key={item.name} onClick={() => window.open(item.installLink)}>
                  <img src={isDarkMode ? item.icon : item.iconLight} alt={item.name} width="20" height="20" />
                  <span>{item.name}</span>
                </NetworkItemWrapper>
              ))}
          </NetworkWrapper>
        )}
      </BrowserView>
    </Layout>
  )
}

const TouchAbleVideo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
`

function VideoSwap({ videoStyle = {} }: { videoStyle: CSSProperties }) {
  const { mixpanelHandler } = useMixpanel()
  const [playedVideo, setPlayedVideo] = useState(false)
  const ref = useRef<HTMLIFrameElement | null>(null)

  const playVideo = () => {
    const iframe = ref.current
    if (iframe) {
      // play video
      iframe.setAttribute('src', iframe.getAttribute('src') + '?autoplay=1')
      mixpanelHandler(MIXPANEL_TYPE.TUTORIAL_VIEW_VIDEO_SWAP)
      setPlayedVideo(true)
    }
  }

  return (
    <Layout title={LIST_TITLE.START_TRADING}>
      <Desc>
        <Trans>Swap today!</Trans>
      </Desc>
      <div style={{ position: 'relative' }}>
        <iframe
          ref={ref}
          width="100%"
          height="100%"
          style={videoStyle}
          src={`https://www.youtube.com/embed/${getTutorialVideoId(TutorialType.SWAP)}`}
          frameBorder="0"
          title="Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/** because we need tracking we user click video, iframe youtube not fire any event for us. */}
        {!playedVideo && !isMobile && <TouchAbleVideo onClick={playVideo} />}
      </div>
    </Layout>
  )
}

// override lib css
const CustomCss = createGlobalStyle`
  [id^=walktour-tooltip-container]:focus-visible {
    outline: none;
  };
`
const getListSteps = (isLogin: boolean, isSolana: boolean) => {
  let stepNumber = 0
  const isHighlightBtnConnectWallet = !isLogin || isMobile
  return filterTruthy([
    {
      customTitleRenderer: () => (
        <Heading style={{ fontSize: 20 }}>
          <Trans>{LIST_TITLE.WELCOME}</Trans>
        </Heading>
      ),
      customFooterRenderer: (logic: WalktourLogic) => (
        <Flex justifyContent={'space-between'} style={{ gap: 25, marginTop: 20 }}>
          <ButtonOutlined onClick={() => logic.close()}>
            <Trans>Maybe later</Trans>
          </ButtonOutlined>
          <ButtonPrimary onClick={() => logic.next()}>
            <Trans>Let’s get started</Trans>
          </ButtonPrimary>
        </Flex>
      ),
      stepNumber: stepNumber++,
      description: <Welcome />,
      pcOnly: true,
      center: true,
      popupStyle: { width: 500 },
    },
    {
      selector: isHighlightBtnConnectWallet ? TutorialIds.BUTTON_CONNECT_WALLET : TutorialIds.BUTTON_ADDRESS_WALLET,
      title: isHighlightBtnConnectWallet ? LIST_TITLE.CONNECT_WALLET : LIST_TITLE.YOUR_WALLET,
      stepNumber: stepNumber++,
      description: <ConnectWallet />,
      orientationPreferences: [CardinalOrientation.SOUTHEAST, CardinalOrientation.NORTHWEST],
    },
    {
      selector: TutorialIds.SELECT_NETWORK,
      title: LIST_TITLE.SELECT_NETWORK,
      stepNumber: stepNumber++,
      description: (
        <Layout title={LIST_TITLE.SELECT_NETWORK}>
          <Desc>
            <Trans>Swap. Choose your network and swap.</Trans>
          </Desc>
          <ImageMobile imageName="step2.png" />
        </Layout>
      ),
      orientationPreferences: [CardinalOrientation.SOUTHEAST, CardinalOrientation.NORTHWEST],
    },
    {
      selector: TutorialIds.SWAP_FORM,
      title: LIST_TITLE.START_TRADING,
      stepNumber: stepNumber++,
      description: <VideoSwap videoStyle={{ minHeight: Math.min(window.innerHeight / 2, 500) }} />,
      popupStyle: { width: Math.min(0.8 * window.innerWidth, 700) },
      requiredClickSelector: '#' + TutorialIds.BUTTON_SETTING_SWAP_FORM,
      selectorHint: '#' + TutorialIds.SWAP_FORM_CONTENT,
    },
    {
      selector: TutorialIds.BUTTON_SETTING_SWAP_FORM,
      title: LIST_TITLE.SETTING,
      stepNumber: stepNumber,
      maskPadding: 10,
      description: (
        <Layout title={LIST_TITLE.SETTING}>
          <Desc>
            <Trans></Trans>
          </Desc>
          <ImageMobile imageName="step4.1.png" />
          <ImageMobile imageName="step4.2.png" marginTop />
        </Layout>
      ),
      hasPointer: true,
      orientationPreferences: [CardinalOrientation.EAST, CardinalOrientation.NORTH],
      spotlightInteraction: true,
    },
    {
      selector: TutorialIds.SWAP_FORM,
      title: LIST_TITLE.SETTING,
      stepNumber: stepNumber++,
      requiredClickSelector: '#' + TutorialIds.BUTTON_SETTING_SWAP_FORM,
      selectorHint: '#' + TutorialIds.TRADING_SETTING_CONTENT,
      description: (
        <Layout title={LIST_TITLE.SETTING}>
          <Desc>
            <Trans></Trans>
          </Desc>
          <Desc>
            <Trans></Trans>
          </Desc>
        </Layout>
      ),
      pcOnly: true,
      callbackEndStep: () => document.getElementById(TutorialIds.BUTTON_SETTING_SWAP_FORM)?.click(),
      orientationPreferences: [CardinalOrientation.EAST, CardinalOrientation.NORTH],
      maskPadding: 10,
    },
    {
      selector: TutorialIds.BRIDGE_LINKS,
      title: LIST_TITLE.BRIDGE,
      stepNumber: stepNumber++,
      description: (
        <Layout title={LIST_TITLE.BRIDGE}>
          <Desc>
            <Trans>
              You can <b>Buy crypto easily with over 50+ currencies using a wide range of payment options!</b> or{' '}
              <b>Easily transfer tokens from one chain to another</b>
            </Trans>
          </Desc>
        </Layout>
      ),
      orientationPreferences: [CardinalOrientation.SOUTH],
    },
    isSolana
      ? null
      : {
          selector: TutorialIds.EARNING_LINKS,
          title: LIST_TITLE.EARN,
          stepNumber: stepNumber++,
          description: (
            <Layout title={LIST_TITLE.EARN}>
              <Desc>
                <Trans>Easily earn fees as a liquidity provider.</Trans>
              </Desc>
              <ImageMobile imageName="step5.png" />
            </Layout>
          ),
          orientationPreferences: [CardinalOrientation.SOUTH],
        },
    {
      selector: TutorialIds.CAMPAIGN_LINK,
      title: LIST_TITLE.CAMPAIGN,
      stepNumber: stepNumber++,
      description: (
        <Layout title={LIST_TITLE.CAMPAIGN}>
          <Desc>
            <Trans></Trans>
          </Desc>
          <ImageMobile imageName="menu.png" />
          <ImageMobile imageName="step7.png" marginTop />
        </Layout>
      ),
      orientationPreferences: [CardinalOrientation.SOUTH],
    },
    {
      selector: TutorialIds.DISCOVER_LINK,
      title: LIST_TITLE.DISCOVER,
      stepNumber: stepNumber++,
      description: (
        <Layout title={LIST_TITLE.DISCOVER}>
          <Desc>
            <Trans>Gtps.Finance</Trans>
          </Desc>
          <ImageMobile imageName="menu.png" />
          <ImageMobile imageName="step6.png" marginTop />
        </Layout>
      ),
      orientationPreferences: [CardinalOrientation.SOUTH, CardinalOrientation.SOUTHEAST],
    },
    {
      selector: TutorialIds.BUTTON_VIEW_GUIDE_SWAP,
      title: LIST_TITLE.VIEW_GUIDE,
      stepNumber: stepNumber++,
      maskPadding: 10,
      requiredClickSelector: '#' + TutorialIds.BUTTON_SETTING,
      stopPropagationMouseDown: true,
      lastStep: true,
      description: (
        <Layout title={LIST_TITLE.VIEW_GUIDE}>
          <Desc>
            <Trans></Trans>
          </Desc>
          <Desc>
            <Trans>
              For a more detailed user guide, <ExternalLink href="https://gtpsfinance.org">click here.</ExternalLink>
            </Trans>
          </Desc>
          <ImageMobile imageName="step8.1.png" />
          <ImageMobile imageName="step8.2.png" marginTop />
        </Layout>
      ),
    },
  ])
}

const TutorialKeys = {
  SHOWED_SWAP_GUIDE: 'showedTutorialSwapGuide',
}

export default memo(function TutorialSwap() {
  const [{ show = false, step = 0 }, setShowTutorial] = useTutorialSwapGuide()
  const stopTutorial = () => setShowTutorial({ show: false })
  const { account, isSolana } = useActiveWeb3React()
  const { mixpanelHandler } = useMixpanel()

  useEffect(() => {
    if (!localStorage.getItem(TutorialKeys.SHOWED_SWAP_GUIDE)) {
      // auto show for first time all user
      setShowTutorial({ show: true, step: 0 })
      localStorage.setItem(TutorialKeys.SHOWED_SWAP_GUIDE, '1')
    }
  }, [setShowTutorial])

  const steps = useMemo(() => {
    const list = getListSteps(!!account, isSolana)
    if (isMobile) {
      return list
        .filter(e => !e.pcOnly)
        .map(({ title, description }, i) => ({
          title: `${i + 1}. ${title}`,
          content: description,
        }))
    }
    return list.map(e => ({
      ...e,
      description: e.description as unknown as string, // because this lib type check description is string but actually it accept any
      selector: '#' + e.selector,
    }))
  }, [account, isSolana])

  const stepInfo = (steps[step] || {}) as StepTutorial

  const onDismiss = (logic: WalktourLogic) => {
    const { stepNumber } = stepInfo
    mixpanelHandler(MIXPANEL_TYPE.TUTORIAL_CLICK_DENY, stepNumber)
    stopTutorial()
    logic.close()
  }

  const onFinished = () => {
    mixpanelHandler(MIXPANEL_TYPE.TUTORIAL_CLICK_DONE)
    stopTutorial()
  }

  const checkRequiredClick = (nextStep: StepTutorial) => {
    const { requiredClickSelector, selectorHint } = nextStep
    const needClick = requiredClickSelector && !document.querySelector(selectorHint || nextStep?.selector)
    // target next step has not render yet, => click other button to render it
    // ex: click button setting to show setting popup, and then highlight content of setting
    if (needClick) {
      const button: HTMLButtonElement | null = document.querySelector(requiredClickSelector)
      button?.click()
    }
    return needClick
  }

  const processNextStep = ({ allSteps, prev, next, stepIndex }: WalktourLogic, isNext: boolean) => {
    const nextIndex = isNext ? stepIndex + 1 : stepIndex - 1
    const needClickAnyElement = checkRequiredClick(allSteps[nextIndex])
    const { callbackEndStep } = stepInfo
    callbackEndStep && callbackEndStep()
    setTimeout(
      () => {
        setShowTutorial({ step: nextIndex, stepInfo: allSteps[nextIndex] })
        isNext ? next() : prev()
      },
      needClickAnyElement ? 400 : 0,
    )
  }

  const onNext = (logic: WalktourLogic) => {
    const { stepIndex, close, allSteps } = logic
    const { lastStep } = allSteps[stepIndex] as StepTutorial
    if (lastStep) {
      onFinished()
      close()
      return
    }
    // next
    processNextStep(logic, true)
  }

  const onBack = (logic: WalktourLogic) => {
    processNextStep(logic, false)
  }

  if (!show) return null
  if (isMobile) return <TutorialMobile stopTutorial={stopTutorial} steps={steps as ToggleItemType[]} />
  return (
    <>
      <Walktour
        tooltipSeparation={25}
        disableMaskInteraction
        customTooltipRenderer={(props: WalktourLogic | undefined) => (
          <CustomPopup {...(props || ({} as WalktourLogic))} />
        )}
        steps={steps as Step[]}
        isOpen={show}
        initialStepIndex={step}
        customNextFunc={onNext}
        customPrevFunc={onBack}
        customCloseFunc={onDismiss}
        renderMask={options => <CustomMask options={options} stepInfo={stepInfo} />}
      />
      <CustomCss />
    </>
  )
})

import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  Circle,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  Spacer,
  Text,
  useToken,
  VStack,
} from '@chakra-ui/react';
import { faChevronRight, faChevronUp } from '@fortawesome/pro-light-svg-icons';
import { Icon } from '@lib/icon';
import { withDefaultServerSideProps } from '@lib/props';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
// import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import debounce from 'debounce';
// import hsl from 'hsl-to-hex';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import * as PIXI from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import usePalette from 'src/hooks/use-palette.hook';

// return a random number within a range
function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
function map(n: number, start1: number, end1: number, start2: number, end2: number) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Orb class
class Orb {
  noiseFn = createNoise2D();
  // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
  constructor(fill = 0x000000) {
    // bounds = the area an orb is "allowed" to move within
    this.bounds = this.setBounds();
    // initialise the orb's { x, y } values to a random point within it's bounds
    this.x = random(this.bounds['x'].min, this.bounds['x'].max);
    this.y = random(this.bounds['y'].min, this.bounds['y'].max);

    // how large the orb is vs it's original radius (this will modulate over time)
    this.scale = 1;

    // what color is the orb?
    this.fill = fill;

    // the original radius of the orb, set relative to window height
    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

    // starting points in "time" for the noise/self similar random values
    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);
    // how quickly the noise/self similar random values step through time
    this.inc = 0.002;

    // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    // 250ms after the last window resize event, recalculate orb positions.
    window.addEventListener(
      'resize',
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250),
    );
  }

  setBounds() {
    // how far from the { x, y } origin can each orb move
    const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
    // the { x, y } origin for each orb (the bottom right of the screen)
    const originX = window.innerWidth / 1.25;
    const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 1.375;

    // allow each orb to move x distance away from it's { x, y }origin
    return {
      x: {
        min: originX - maxDist,
        max: originX + maxDist,
      },
      y: {
        min: originY - maxDist,
        max: originY + maxDist,
      },
    };
  }

  update() {
    // self similar "psuedo-random" or noise values at a given point in "time"
    const xNoise = this.noiseFn(this.xOff, this.xOff);
    const yNoise = this.noiseFn(this.yOff, this.yOff);
    const scaleNoise = this.noiseFn(this.xOff, this.yOff);

    // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
    this.x = map(xNoise, -1, 1, this.bounds['x'].min, this.bounds['x'].max);
    this.y = map(yNoise, -1, 1, this.bounds['y'].min, this.bounds['y'].max);
    // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
    this.scale = map(scaleNoise, -1, 1, 0.5, 1);

    // step through "time"
    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  render() {
    // update the PIXI.Graphics position and scale values
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);

    // clear anything currently drawn to graphics
    this.graphics.clear();

    // tell graphics to fill any shapes drawn after this with the orb's fill color
    this.graphics.beginFill(this.fill);
    // draw a circle at { 0, 0 } with it's size set by this.radius
    this.graphics.drawCircle(0, 0, this.radius);
    // let graphics know we won't be filling in any more shapes
    this.graphics.endFill();
  }
}

const Lava = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pixiApp, setPixiApp] = useState<PIXI.Application | null>(null);
  const [pink200] = useToken('colors', ['pink.200']);
  const { randomColor } = usePalette({ color: pink200 });

  useEffect(() => {
    if (pixiApp) return;

    const app = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 0,
    });

    canvasRef.current?.appendChild(app.view as any);

    const orbs = [];

    for (let i = 0; i < 10; i++) {
      // each orb will be black, just for now
      const orb = new Orb(randomColor());
      app.stage.addChild(orb.graphics);

      orbs.push(orb);
    }

    // Animate!
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      app.ticker.add(() => {
        // update and render each orb, each frame. app.ticker attempts to run at 60fps
        orbs.forEach((orb) => {
          orb.update();
          orb.render();
        });
      });
    } else {
      // perform one update and render per orb, do not animate
      orbs.forEach((orb) => {
        orb.update();
        orb.render();
      });
    }

    app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

    setPixiApp(app);
  }, [randomColor, pixiApp]);

  return <Box ref={canvasRef} pos="absolute" />;
};

export const getServerSideProps: GetServerSideProps = withDefaultServerSideProps({ secure: true });

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Retrobox | Home V2</title>
        <meta name="description" content="Retrobox home" />
      </Head>
      <Lava />
      <Flex as="section" direction="column" w="full" p="10">
        <VStack alignItems="left" mb={8} spacing={6}>
          <Breadcrumb separator={<Icon icon={faChevronRight} />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Boxes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Design Box</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Heading as="h2" size="2xl">
            Design Box
          </Heading>
          <HStack>
            <Badge colorScheme="red">Public</Badge>
            <Badge colorScheme="red">Belongs to design team</Badge>
            <Badge colorScheme="red">Created by Luke Bayliss</Badge>
          </HStack>
        </VStack>

        <VStack spacing="4">
          <Card w="full" p="6" bg="rgba(255,255,255,0.3)" backdropFilter="blur(5px)">
            <HStack>
              <Icon icon={faChevronUp} />
              <Heading size="lg">This Week</Heading>
              <HStack fontWeight="semibold">
                <Circle bg="green.300" size="2" />
                <Text color="green.300">OPEN</Text>
              </HStack>
              <Spacer />
              <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Button color="red" variant="solid">
                3 Items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItemOption command="⌘T" icon={<AddIcon />}>
                    New Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘N" icon={<ExternalLinkIcon />}>
                    New Window
                  </MenuItemOption>
                  <MenuItemOption command="⌘⇧N" icon={<RepeatIcon />}>
                    Open Closed Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘O" icon={<EditIcon />}>
                    Open File...
                  </MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>
          </Card>

          <Card w="full" p="6" bg="rgba(255,255,255,0.3)" backdropFilter="blur(5px)">
            <HStack>
              <Icon icon={faChevronUp} />
              <Heading size="lg">This Week</Heading>
              <Spacer />
              <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Button color="red" variant="solid">
                10 Items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItemOption command="⌘T" icon={<AddIcon />}>
                    New Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘N" icon={<ExternalLinkIcon />}>
                    New Window
                  </MenuItemOption>
                  <MenuItemOption command="⌘⇧N" icon={<RepeatIcon />}>
                    Open Closed Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘O" icon={<EditIcon />}>
                    Open File...
                  </MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>
          </Card>

          <Card w="full" p="6" bg="rgba(255,255,255,0.3)" backdropFilter="blur(5px)">
            <HStack>
              <Icon icon={faChevronUp} />
              <Heading size="lg">This Week</Heading>
              <Spacer />
              <AvatarGroup max={2} size="sm">
                <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Button color="red" variant="solid">
                6 Items
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItemOption command="⌘T" icon={<AddIcon />}>
                    New Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘N" icon={<ExternalLinkIcon />}>
                    New Window
                  </MenuItemOption>
                  <MenuItemOption command="⌘⇧N" icon={<RepeatIcon />}>
                    Open Closed Tab
                  </MenuItemOption>
                  <MenuItemOption command="⌘O" icon={<EditIcon />}>
                    Open File...
                  </MenuItemOption>
                </MenuList>
              </Menu>
            </HStack>
          </Card>
        </VStack>
      </Flex>
    </>
  );
};

export default HomePage;

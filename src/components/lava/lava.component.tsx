import { Box, useToken } from '@chakra-ui/react';
import Orb from '@lib/orbs';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import * as PIXI from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import usePalette from 'src/hooks/use-palette.hook';

const Lava = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [pixiApp, setPixiApp] = useState<PIXI.Application | null>(null);
  const [orbCount, setOrbCount] = useState<number>(25);
  const [orbs, setOrbs] = useState<Orb[]>([]);

  const [blue200] = useToken('colors', ['yellow.300']);
  const { getColor } = usePalette({ color: blue200 });

  // Init PIXI Application
  useEffect(() => {
    if (pixiApp) return;

    const app = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 0,
    });

    canvasRef.current?.appendChild(app.view as any);

    app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

    setPixiApp(app);
  }, [pixiApp]);

  // Init and update Orb list
  useEffect(() => {
    if (!pixiApp) return;
    if (orbs.length === orbCount) return;

    if (orbCount === 0) {
      setOrbs([]);
    }

    for (let i = 0; i < orbCount; i++) {
      orbs.push(new Orb(+getColor()));
    }
  }, [getColor, orbCount, orbs, pixiApp]);

  useEffect(() => {
    if (!pixiApp) return;

    orbs.forEach((orb) => pixiApp.stage.addChild(orb.graphics));

    pixiApp.ticker.add(() => {
      orbs.forEach((orb) => {
        orb.update();
        orb.render();
      });
    });
  }, [orbs, pixiApp]);

  return <Box ref={canvasRef} pos="absolute" zIndex="hide" />;
};

export default Lava;

import hexToHsl from 'hex-to-hsl';
import hslToHex from 'hsl-to-hex';
import { useState } from 'react';

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Props {
  color: string;
}

const usePalette = ({ color }: Props) => {
  const propHsl = hexToHsl(color);

  const [hue, setHue] = useState(propHsl[0]);
  const [complimentaryHue1, setComplimentaryHue1] = useState(hue - 30);
  const [complimentaryHue2, setComplimentaryHue2] = useState(hue + 30);
  const [saturation, setSaturation] = useState(propHsl[1]);
  const [lightness, setLightness] = useState(propHsl[2]);

  const [baseColor, setBaseColor] = useState(hslToHex(hue, saturation, lightness));
  const [complimentaryColor1, setComplimentaryColor1] = useState(
    hslToHex(complimentaryHue1, saturation, lightness),
  );
  const [complimentaryColor2, setComplimentaryColor2] = useState(
    hslToHex(complimentaryHue2, saturation, lightness),
  );

  const [colorChoices, setColorChoices] = useState([
    baseColor,
    complimentaryColor1,
    complimentaryColor2,
  ]);

  const getColor = () => colorChoices[~~random(0, colorChoices.length)].replace('#', '0x');

  return { getColor };
};

export default usePalette;

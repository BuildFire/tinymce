import { Arr, Obj } from '@ephox/katamari';
import { SugarPosition } from '@ephox/sugar';

export interface BubbleInstance {
  readonly offset: SugarPosition;
  readonly classesOn: string[];
  readonly classesOff: string[];
}

export interface Bubble {
  southeast: () => BubbleInstance;
  southwest: () => BubbleInstance;
  northwest: () => BubbleInstance;
  northeast: () => BubbleInstance;
  south: () => BubbleInstance;
  north: () => BubbleInstance;
  east: () => BubbleInstance;
  west: () => BubbleInstance;
  insetSoutheast: () => BubbleInstance;
  insetSouthwest: () => BubbleInstance;
  insetNorthwest: () => BubbleInstance;
  insetNortheast: () => BubbleInstance;
  insetSouth: () => BubbleInstance;
  insetNorth: () => BubbleInstance;
  insetEast: () => BubbleInstance;
  insetWest: () => BubbleInstance;
}

export interface BubbleAlignments {
  // Used for east and west
  valignCentre?: string[];

  // Used for *east
  alignLeft?: string[];
  // Used for *west
  alignRight?: string[];
  // Used for *middle
  alignCentre?: string[];

  // Used for south*
  top?: string[];
  bottom?: string[];
  // Used for east
  left?: string[];
  // Used for west
  right?: string[];

  // Used for insets
  inset?: string[];
}

const allAlignments: Array<keyof BubbleAlignments> = [
  'valignCentre',

  'alignLeft',
  'alignRight',
  'alignCentre',

  'top',
  'bottom',
  'left',
  'right',

  'inset'
];

const nu = (width: number, yoffset: number, classes: BubbleAlignments, insetModifier: number = 1): Bubble => {
  const insetWidth = width * insetModifier;
  const insetYoffset = yoffset * insetModifier;

  const getClasses = (prop: keyof BubbleAlignments): string[] => Obj.get(classes, prop).getOr([ ]);

  const make = (xDelta: number, yDelta: number, alignmentsOn: Array<(keyof BubbleAlignments)>) => {
    const alignmentsOff = Arr.difference(allAlignments, alignmentsOn);
    return {
      offset: SugarPosition(xDelta, yDelta),
      classesOn: Arr.bind(alignmentsOn, getClasses),
      classesOff: Arr.bind(alignmentsOff, getClasses)
    };
  };

  return {
    southeast: () => make(-width, yoffset, [ 'top', 'alignLeft' ]),
    southwest: () => make(width, yoffset, [ 'top', 'alignRight' ]),
    south: () => make(-width / 2, yoffset, [ 'top', 'alignCentre' ]),
    northeast: () => make(-width, -yoffset, [ 'bottom', 'alignLeft' ]),
    northwest: () => make(width, -yoffset, [ 'bottom', 'alignRight' ]),
    north: () => make(-width / 2, -yoffset, [ 'bottom', 'alignCentre' ]),
    east: () => make(width, -yoffset / 2, [ 'valignCentre', 'left' ]),
    west: () => make(-width, -yoffset / 2, [ 'valignCentre', 'right' ]),
    insetNortheast: () => make(insetWidth, insetYoffset, [ 'top', 'alignLeft', 'inset' ]),
    insetNorthwest: () => make(-insetWidth, insetYoffset, [ 'top', 'alignRight', 'inset' ]),
    insetNorth: () => make(-insetWidth / 2, insetYoffset, [ 'top', 'alignCentre', 'inset' ]),
    insetSoutheast: () => make(insetWidth, -insetYoffset, [ 'bottom', 'alignLeft', 'inset' ]),
    insetSouthwest: () => make(-insetWidth, -insetYoffset, [ 'bottom', 'alignRight', 'inset' ]),
    insetSouth: () => make(-insetWidth / 2, -insetYoffset, [ 'bottom', 'alignCentre', 'inset' ]),
    insetEast: () => make(-insetWidth, -insetYoffset / 2, [ 'valignCentre', 'right', 'inset' ]),
    insetWest: () => make(insetWidth, -insetYoffset / 2, [ 'valignCentre', 'left', 'inset' ])
  };
};

const fallback = (): Bubble => nu(0, 0, { });

export {
  nu,
  fallback
};

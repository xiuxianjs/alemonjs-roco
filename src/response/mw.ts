import { EventsEnum } from 'alemonjs';

export default (e: EventsEnum) => {
  console.log('[洛克王国]', e.name);

  return true;
};

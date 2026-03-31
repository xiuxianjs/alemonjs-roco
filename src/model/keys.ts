const prefix = 'data:alemonjs-roco';

export const rocoKeys = {
  base: (data?: string) => `${prefix}${data ?? ''}`
};

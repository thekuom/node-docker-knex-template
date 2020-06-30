import Chance from 'chance';

import * as t from 'src/entities';

const chance = new Chance() as Chance.Chance;

const mixin = {
  user: (options: Partial<t.User> = {}): t.User => {
    const defaults = {
      id: chance.guid(),
      name: chance.name(),
    };

    return {
      ...defaults,
      ...options,
    };
  },
};

type Mixins = typeof mixin;
chance.mixin(mixin);

export const random = chance as Chance.Chance & Mixins;

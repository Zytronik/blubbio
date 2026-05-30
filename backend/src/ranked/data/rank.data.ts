import { Rank } from '@shared/types';

const e_minus: Rank = {
  name: 'E-',
  iconName: 'e_minus',
  ascii: 'ε',
  percentile: 100,
};

const e_plus: Rank = {
  name: 'E+',
  iconName: 'e_plus',
  ascii: 'Ε',
  percentile: 95,
};

const d_minus: Rank = {
  name: 'D-',
  iconName: 'd_minus',
  ascii: 'δ',
  percentile: 90,
};

const d_plus: Rank = {
  name: 'D+',
  iconName: 'd_plus',
  ascii: 'Δ',
  percentile: 84,
};

const c_minus: Rank = {
  name: 'C-',
  iconName: 'c_minus',
  ascii: 'γ',
  percentile: 78,
};

const c_plus: Rank = {
  name: 'C+',
  iconName: 'c_plus',
  ascii: 'Γ',
  percentile: 70,
};

const b_minus: Rank = {
  name: 'B-',
  iconName: 'b_minus',
  ascii: 'β',
  percentile: 62,
};

const b_plus: Rank = {
  name: 'B+',
  iconName: 'b_plus',
  ascii: 'Β',
  percentile: 54,
};

const a_minus: Rank = {
  name: 'A-',
  iconName: 'a_minus',
  ascii: 'α',
  percentile: 46,
};

const a_plus: Rank = {
  name: 'A+',
  iconName: 'a_plus',
  ascii: 'Α',
  percentile: 38,
};

const s_minus: Rank = {
  name: 'S-',
  iconName: 's_minus',
  ascii: 'σ',
  percentile: 30,
};

const s_plus: Rank = {
  name: 'S+',
  iconName: 's_plus',
  ascii: 'Σ',
  percentile: 23,
};

const w_minus: Rank = {
  name: 'W-',
  iconName: 'w_minus',
  ascii: 'ω',
  percentile: 17,
};

const w_plus: Rank = {
  name: 'W+',
  iconName: 'w_plus',
  ascii: 'Ω',
  percentile: 11,
};

const p_minus: Rank = {
  name: 'P-',
  iconName: 'p_minus',
  ascii: 'π',
  percentile: 5,
};

const p_plus: Rank = {
  name: 'P+',
  iconName: 'p_plus',
  ascii: 'Π',
  percentile: 1,
};

export const ranks: Rank[] = [
  e_minus,
  e_plus,
  d_minus,
  d_plus,
  c_minus,
  c_plus,
  b_minus,
  b_plus,
  a_minus,
  a_plus,
  s_minus,
  s_plus,
  w_minus,
  w_plus,
  p_minus,
  p_plus,
];

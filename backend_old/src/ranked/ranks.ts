export interface Rank {
  name: string;
  ascii: string;
  percentile: number;
  iconName: string;
}

export const unrankedRatingDeviation = 200;

interface AllRanks {
  e_minus: Rank;
  e_plus: Rank;
  d_minus: Rank;
  d_plus: Rank;
  c_minus: Rank;
  c_plus: Rank;
  b_minus: Rank;
  b_plus: Rank;
  a_minus: Rank;
  a_plus: Rank;
  s_minus: Rank;
  s_plus: Rank;
  w_minus: Rank;
  w_plus: Rank;
  p_minus: Rank;
  p_plus: Rank;
}

export const ranks: AllRanks = {
  e_minus: {
    name: 'E-',
    iconName: 'e_minus',
    ascii: 'ε',
    percentile: 100,
  },
  e_plus: {
    name: 'E+',
    iconName: 'e_plus',
    ascii: 'Ε',
    percentile: 95,
  },
  d_minus: {
    name: 'D-',
    iconName: 'd_minus',
    ascii: 'δ',
    percentile: 90,
  },
  d_plus: {
    name: 'D+',
    iconName: 'd_plus',
    ascii: 'Δ',
    percentile: 84,
  },
  c_minus: {
    name: 'C-',
    iconName: 'c_minus',
    ascii: 'γ',
    percentile: 78,
  },
  c_plus: {
    name: 'C+',
    iconName: 'c_plus',
    ascii: 'Γ',
    percentile: 70,
  },
  b_minus: {
    name: 'B-',
    iconName: 'b_minus',
    ascii: 'β',
    percentile: 62,
  },
  b_plus: {
    name: 'B+',
    iconName: 'b_plus',
    ascii: 'Β',
    percentile: 54,
  },
  a_minus: {
    name: 'A-',
    iconName: 'a_minus',
    ascii: 'α',
    percentile: 46,
  },
  a_plus: {
    name: 'A+',
    iconName: 'a_plus',
    ascii: 'Α',
    percentile: 38,
  },
  s_minus: {
    name: 'S-',
    iconName: 's_minus',
    ascii: 'σ',
    percentile: 30,
  },
  s_plus: {
    name: 'S+',
    iconName: 's_plus',
    ascii: 'Σ',
    percentile: 23,
  },
  w_minus: {
    name: 'W-',
    iconName: 'w_minus',
    ascii: 'ω',
    percentile: 17,
  },
  w_plus: {
    name: 'W+',
    iconName: 'w_plus',
    ascii: 'Ω',
    percentile: 11,
  },
  p_minus: {
    name: 'P-',
    iconName: 'p_minus',
    ascii: 'π',
    percentile: 5,
  },
  p_plus: {
    name: 'P+',
    iconName: 'p_plus',
    ascii: 'Π',
    percentile: 1,
  },
};

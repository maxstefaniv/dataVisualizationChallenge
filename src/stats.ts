// crear el encabezado y exportarlo
export interface StatsEntry {
  name: string;
  value: number;
}
//aqui abajo tipar el array

export const stats: StatsEntry[] = [
  {
    name: "New South Wales",
    value: 6
  },
  {
    name: "North Australia",
    value: 0
  },
  {
    name: "Queensland",
    value: 9
  },
  {
    name: "South Australia",
    value: 2
  },
  {
    name: "Tasmania",
    value: 0
  },
  {
    name: "Victoria",
    value: 7
  },
  {
    name: "Western Australia",
    value: 2
  }
];

export const stats20200326: StatsEntry[] = [
  {
    name: "New South Wales",
    value: 1219
  },
  {
    name: "North Australia",
    value: 12
  },
  {
    name: "Queensland",
    value: 493
  },
  {
    name: "South Australia",
    value: 235
  },
  {
    name: "Tasmania",
    value: 43
  },
  {
    name: "Victoria",
    value: 520
  },
  {
    name: "Western Australia",
    value: 231
  }
];
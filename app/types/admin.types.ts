export interface Theme {
  id: number;
  name: string;
  description?: string;
}

export interface Section {
  id: number;
  title: string;
  cefr: string;
}

export interface Unit {
  id: number;
  sectionId: number;
  grammarPoint: string;
}

export interface Quiz {
  id: number;
  question: string;
  cefr: string;
  unitId: number;
}

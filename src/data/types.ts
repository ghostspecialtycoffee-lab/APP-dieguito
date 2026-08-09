export type Farm = {
  _id: string;
  _creationTime: number;
  name: string;
  owner: string;
  address: string;
  altitude: number;
  areaHa: number;
  plantCount?: number;
  variety?: string;
  sowingDate?: string;
  createdAt: number;
};

export type Visit = {
  _id: string;
  _creationTime: number;
  farmId: string;
  date: string;
  visitType: string;
  technician: string;
  weather?: string;
  observations?: string;
  activities: string[];
  recommendations: string[];
  photoUrls: string[];
  nextVisitDate?: string;
  createdAt: number;
};

export type WorkPlanActivity = {
  name: string;
  completed: boolean;
  inputs?: string;
  scheduledDate?: string;
};

export type WorkPlan = {
  _id: string;
  _creationTime: number;
  farmId: string;
  objective: string;
  activities: WorkPlanActivity[];
  responsible?: string;
  scheduleStart?: string;
  scheduleEnd?: string;
  updatedAt: number;
};

export type Diagnostic = {
  _id: string;
  _creationTime: number;
  farmId: string;
  cropAge?: number;
  spacing?: string;
  shadeType?: string;
  sowingSystem?: string;
  fertilizationFreq?: string;
  lastFertilization?: string;
  observations?: string;
  soilPh?: number;
  organicMatter?: number;
  phosphorus?: number;
  potassium?: number;
  calcium?: number;
  magnesium?: number;
  aluminum?: number;
  soilPdfName?: string;
  updatedAt: number;
};

export type Alert = {
  _id: string;
  _creationTime: number;
  farmId?: string;
  title: string;
  message: string;
  type: "visit" | "activity" | "general";
  dueDate?: string;
  read: boolean;
  createdAt: number;
};

export type LocalDatabase = {
  farms: Farm[];
  visits: Visit[];
  workPlans: WorkPlan[];
  diagnostics: Diagnostic[];
  alerts: Alert[];
};

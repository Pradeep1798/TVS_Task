import { NotificationSource } from "utils/utils";

export interface Case {
  id: string;
  title: string;
  body: string;
  receivedAt: number;
  source: NotificationSource;
}

export interface CasesState {
  items: Case[];
}
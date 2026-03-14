import { ChargeTypeResponse } from "../../charge-type-management/models/ChargeTypeResponse";
import { FeeRecurrenceRuleResponse } from "./FeeRecurrenceRuleResponse";

export interface FeeCatalogResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  chargeType: ChargeTypeResponse;
  recurrenceRule?: FeeRecurrenceRuleResponse;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

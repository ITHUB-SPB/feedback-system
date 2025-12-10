import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"; 

export const statement = {
  ...defaultStatements,
  administrativeUnit: ["list", "read", "update", "create", "delete"],
  administrativeUnitType: ["list"],
  feedBack: ["create", "update", "read", "list"],
  feedBackStatus: ["list"],
  feedBackType: ["list"],
  officialResponsibility: ["list", "create", "update", "delete"],
  person: ["list", "read", "update", "create", "delete"],
  topic: ["list", "create"],
  topicCategory: ["list", "create"],
  votingRegion: ["list", "read", "update", "create", "delete"],
  votingUnit: ["list", "read", "update", "create", "delete"],
  votingVote: ["list", "read", "create", "delete"],
  project: ["create", "update", "delete", "read", "list"], 
  // какие есть права доступа для контрактов
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  project: ["create", "update"],
  ...adminAc.statements,
});
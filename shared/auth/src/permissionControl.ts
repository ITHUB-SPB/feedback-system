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
} as const;

export const ac = createAccessControl(statement);

export const superAdmin = ac.newRole({
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
  ...adminAc.statements,
});

export const moderator = ac.newRole({
  administrativeUnit: ["list", "read", "update", "create", "delete"],
  administrativeUnitType: ["list"],
  feedBack: ["create", "update", "read", "list"],
  feedBackStatus: ["list"],
  feedBackType: ["list"],
  officialResponsibility: ["list", "create", "update", "delete"],
  topic: ["list", "create"],
  topicCategory: ["list", "create"],
  votingRegion: ["list", "read", "update", "create", "delete"],
  votingUnit: ["list", "read", "update", "create", "delete"],
  votingVote: ["list", "read", "create", "delete"],
  project: ["create", "update", "delete", "read", "list"],
});

export const official = ac.newRole({
  feedBack: ["list", "update", "read"],
  votingVote: ["list", "read"],
});

export const citizen = ac.newRole({
  votingVote: ["list"],
  feedBack: ["list"]
});
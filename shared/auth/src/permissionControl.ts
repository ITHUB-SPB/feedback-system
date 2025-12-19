import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  administrativeUnit: ["list", "read", "update", "create", "delete"],
  administrativeUnitType: ["list"],
  feedback: ["create", "update", "read", "list"],
  feedbackStatus: ["list"],
  feedbackType: ["list"],
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

export const roles = {
  superadmin: ac.newRole({
    ...adminAc.statements,
    administrativeUnit: ["list", "read", "update", "create", "delete"],
    administrativeUnitType: ["list"],
    feedback: ["create", "update", "read", "list"],
    feedbackStatus: ["list"],
    feedbackType: ["list"],
    officialResponsibility: ["list", "create", "update", "delete"],
    person: ["list", "read", "update", "create", "delete"],
    topic: ["list", "create"],
    topicCategory: ["list", "create"],
    votingRegion: ["list", "read", "update", "create", "delete"],
    votingUnit: ["list", "read", "update", "create", "delete"],
    votingVote: ["list", "read", "create", "delete"],
    project: ["create", "update", "delete", "read", "list"],
  }),

  moderator: ac.newRole({
    administrativeUnit: ["list", "read", "update", "create", "delete"],
    administrativeUnitType: ["list"],
    feedback: ["create", "update", "read", "list"],
    feedbackStatus: ["list"],
    feedbackType: ["list"],
    officialResponsibility: ["list", "create", "update", "delete"],
    topic: ["list", "create"],
    topicCategory: ["list", "create"],
    votingRegion: ["list", "read", "update", "create", "delete"],
    votingUnit: ["list", "read", "update", "create", "delete"],
    votingVote: ["list", "read", "create", "delete"],
    project: ["create", "update", "delete", "read", "list"],
  }),

  official: ac.newRole({
    feedback: ["list", "update", "read"],
    votingVote: ["list", "read"],
  }),

  citizen: ac.newRole({
    votingVote: ["list"],
    feedback: ["list"],
  }),
};

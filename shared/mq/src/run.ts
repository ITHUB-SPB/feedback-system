import {
  buildCitizenStatusEmailWorker,
  buildCitizenStatusWithCommentEmailWorker,
  buildOfficialWelcomeEmailWorker,
  buildInnerWelcomeEmailWorker,
} from "./worker";

import getConnection from "./connection";

buildCitizenStatusEmailWorker(getConnection());
buildCitizenStatusWithCommentEmailWorker(getConnection());
buildOfficialWelcomeEmailWorker(getConnection());
buildInnerWelcomeEmailWorker(getConnection());

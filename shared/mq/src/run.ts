import {
  buildCitizenStatusEmailWorker,
  buildCitizenStatusWithCommentEmailWorker,
  buildOfficialWelcomeEmailWorker
} from "./worker";
import getConnection from "./connection";

buildCitizenStatusEmailWorker(getConnection());
buildCitizenStatusWithCommentEmailWorker(getConnection());
buildOfficialWelcomeEmailWorker(getConnection())
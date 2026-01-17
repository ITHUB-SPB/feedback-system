import {
  buildCitizenStatusEmailWorker,
  buildCitizenStatusWithCommentEmailWorker,
} from "./worker";
import getConnection from "./connection";

buildCitizenStatusEmailWorker(getConnection());
buildCitizenStatusWithCommentEmailWorker(getConnection());

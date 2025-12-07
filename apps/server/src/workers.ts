import buildMailWorker from "./queue/buildWorker";

["citizen-approved", "citizen-rejected", "official-request"].forEach(
  (queueName) => {
    buildMailWorker(queueName);
  },
);

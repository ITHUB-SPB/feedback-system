import { createFileRoute } from "@tanstack/react-router";
import { OfficialsPage } from "@/pages/officials";

export const Route = createFileRoute("/_authenticated/officials")({
  component: ListOfficials,
});

export default function ListOfficials() {
  return <OfficialsPage />;
}

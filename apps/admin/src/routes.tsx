import React from "react";
import { Routes, Route, Outlet } from "react-router";

import { NavigateToResource } from "@refinedev/react-router";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <Authenticated key="authenticated-routes" redirectOnFail="/login">
            <ThemedLayout
              Title={ThemedTitle}
              Sider={(props) => <ThemedSider {...props} fixed />}
            >
              <Outlet />
            </ThemedLayout>
          </Authenticated>
        }
      >
        <Route index element={<NavigateToResource resource="projects" />} />
        <Route path="/projects">
          <Route index element={<ListProjects />} />
          <Route path=":id" element={<ShowProject />} />
          <Route path=":id/edit" element={<EditProject />} />
          <Route path="create" element={<CreateProject />} />
        </Route>
        <Route path="/issues" element={<ListTopicCategoryTopics />} />
        <Route
          path="/administrative_units"
          element={<ListAdministrativeUnits />}
        />
        <Route path="/feedback">
          <Route index element={<ListFeedback />} />
          <Route path=":id" element={<ShowFeedback />} />
        </Route>
        <Route path="/voting_votes" element={<ListVotingResults />} />
        <Route path="/voting_units" element={<ListVotingUnits />} />
      </Route>
      <Route
        element={
          <Authenticated key="auth-pages" fallback={<Outlet />}>
            <NavigateToResource resource="projects" />
          </Authenticated>
        }
      >
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

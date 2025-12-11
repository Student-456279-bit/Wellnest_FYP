import React from "react";
import Layout from "../components/Layout";
import DashboardView from "./Dashboard.view.jsx";

export default function DashboardLogic(props) {
  return (
    <Layout>
      <DashboardView {...props} />
    </Layout>
  );
}

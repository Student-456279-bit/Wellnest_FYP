import React from "react";
import Layout from "../components/Layout";
import WellnestAiChatbotView from "./WellnestAiChatbot.view.jsx";

export default function WellnestAiChatbotLogic(props) {
  return (
    <Layout>
      <WellnestAiChatbotView {...props} />
    </Layout>
  );
}

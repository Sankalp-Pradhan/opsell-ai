"use client"

import { ChatWidget } from "@/components/chat/ChatWidget";
import Benefits from "./Benefits";
import FeatureBlocks from "./FeatureBlocks";
import Hero from "./Hero";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <Hero />
      <FeatureBlocks />
      <Benefits />
      <ChatWidget />
    </main>
  );
};

export default Index;
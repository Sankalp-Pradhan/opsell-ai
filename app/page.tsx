"use client";

import { GrowthOutcomes } from "./growth/growthoutcomes";
import FAQ from "./home/faq-section";
import { GrowthSection } from "./home/growth-section";
import { Hero } from "./home/hero";
import { IntegrateSection } from "./home/integrate-section";
import ProblemSection from "./home/problem-section";
import RevenueLeakQuiz from "./home/quiz-section";
import { KEYFRAMES } from "./home/styles";

export default function OpsellHomePage() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <Hero />
      <GrowthOutcomes />
      <ProblemSection />
      <GrowthSection />
      <IntegrateSection />
      <RevenueLeakQuiz />
      <FAQ />
      
    </>
  );
}
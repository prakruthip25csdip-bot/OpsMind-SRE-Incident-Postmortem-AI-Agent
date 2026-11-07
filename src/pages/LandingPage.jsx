import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import LiveDemoPreview from '../components/landing/LiveDemoPreview';
import TechStackSection from '../components/landing/TechStackSection';

export default function LandingPage() {
  return (
    <div className="relative">
      <HeroSection />
      <WorkflowSection />
      <FeaturesGrid />
      <LiveDemoPreview />
      <TechStackSection />
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ProcessSection } from './components/ProcessSection';
import { StatsSection } from './components/StatsSection';
import { ProjectEstimator } from './components/ProjectEstimator';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [estimateData, setEstimateData] = useState<{
    projectType: string;
    timeline: string;
    estimatedCost: string;
    features: string[];
  } | null>(null);

  const handleStartProject = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyEstimate = (data: {
    projectType: string;
    timeline: string;
    estimatedCost: string;
    features: string[];
  }) => {
    setEstimateData(data);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForEstimate = (serviceName: string) => {
    const el = document.getElementById('estimator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Navigation */}
      <Navbar onOpenEstimator={() => {
        const el = document.getElementById('estimator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartProject={handleStartProject}
          onExploreWork={handleExploreWork}
        />

        {/* Services Section */}
        <ServicesGrid
          onSelectServiceForEstimate={handleSelectServiceForEstimate}
        />

        {/* Portfolio & Featured Work */}
        <PortfolioGrid />

        {/* Engineering & Delivery Process */}
        <ProcessSection />

        {/* Stats & Social Proof */}
        <StatsSection />

        {/* Interactive Scope & Investment Estimator */}
        <ProjectEstimator onApplyEstimate={handleApplyEstimate} />

        {/* Frequently Addressed Questions */}
        <FaqSection />

        {/* Contact & Discovery Section */}
        <ContactSection initialData={estimateData} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

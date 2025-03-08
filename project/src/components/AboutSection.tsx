import React from 'react';
import { Brain, Globe2, CloudLightning } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border transition-all duration-300 hover:shadow-xl group">
      <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
          alt="AI Climate Analysis"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Predicting Climate Change with AI
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Harnessing the power of artificial intelligence to analyze, predict, and combat climate change 
              with unprecedented accuracy and insight.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl overflow-hidden border">
          <div className="relative h-[200px]">
            <img
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"
              alt="Climate research"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              To revolutionize climate prediction through cutting-edge AI technology, enabling 
              organizations and communities worldwide to make informed decisions and take proactive 
              measures against climate change. We strive to:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Provide accurate climate predictions using advanced AI models
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Enable data-driven decision making for climate action
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Foster global collaboration in climate research
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-card rounded-xl overflow-hidden border">
          <div className="relative h-[200px]">
            <img
              src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80"
              alt="Future technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">Our Vision</h2>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              To become the world's leading platform for climate prediction and analysis, fostering a 
              global community dedicated to addressing climate change through data-driven solutions 
              and collaborative innovation. We aim to:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Lead in AI-powered climate prediction technology
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Build a global network of climate researchers and experts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Drive innovation in climate change solutions
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Brain}
          title="Advanced AI Models"
          description="Our state-of-the-art machine learning algorithms process climate data with 95% accuracy, enabling precise predictions and trend analysis across multiple climate variables."
        />
        <FeatureCard
          icon={Globe2}
          title="Global Coverage"
          description="Comprehensive analysis of climate patterns across all continents and oceans, providing detailed insights into regional and global climate trends."
        />
        <FeatureCard
          icon={CloudLightning}
          title="Real-time Predictions"
          description="Instant updates and forecasts based on latest satellite and sensor data, allowing for rapid response to changing climate conditions."
        />
      </div>
    </div>
  );
}
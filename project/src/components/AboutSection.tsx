import React, { useState } from 'react';
import { Brain, Globe2, CloudLightning, ChevronLeft, ChevronRight, Users, Database, Share2 } from 'lucide-react';

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

const pages = [
  {
    title: "Predicting Climate Change with AI",
    description: "Harnessing the power of artificial intelligence to analyze, predict, and combat climate change with unprecedented accuracy and insight.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Global Impact Analysis",
    description: "Understanding climate change effects across different regions and ecosystems to develop targeted mitigation strategies.",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Data-Driven Solutions",
    description: "Leveraging comprehensive climate data and machine learning to provide actionable insights for environmental protection.",
    image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1600&q=80"
  }
];

export default function AboutSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const goToPage = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <div className={`relative h-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <img
            src={pages[currentPage].image}
            alt={pages[currentPage].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {pages[currentPage].title}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {pages[currentPage].description}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 flex justify-center items-center space-x-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-full ${
              currentPage === 0 
                ? 'bg-white/20 text-white/40 cursor-not-allowed' 
                : 'bg-white/30 text-white hover:bg-white/50 transition-colors'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className={`p-2 rounded-full ${
              currentPage === pages.length - 1
                ? 'bg-white/20 text-white/40 cursor-not-allowed'
                : 'bg-white/30 text-white hover:bg-white/50 transition-colors'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl overflow-hidden border hover:shadow-xl transition-shadow">
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
              measures against climate change.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3 text-primary">
                <Users className="w-5 h-5" />
                <div>
                  <span className="font-medium">Global Community Impact</span>
                  <p className="text-sm text-muted-foreground mt-1">Empowering communities with actionable climate insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-primary">
                <Database className="w-5 h-5" />
                <div>
                  <span className="font-medium">Data-Driven Insights</span>
                  <p className="text-sm text-muted-foreground mt-1">Processing petabytes of climate data for accurate predictions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-primary">
                <Share2 className="w-5 h-5" />
                <div>
                  <span className="font-medium">Collaborative Solutions</span>
                  <p className="text-sm text-muted-foreground mt-1">Fostering global partnerships for climate action</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Key Objectives</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Achieve 95% accuracy in climate predictions by 2025
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Expand coverage to all major climate zones globally
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Develop early warning systems for extreme weather events
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl overflow-hidden border hover:shadow-xl transition-shadow">
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
              and collaborative innovation.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-3">2025 Milestones</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div className="text-sm text-muted-foreground">Countries Covered</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Partner Organizations</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-3">2030 Vision</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-background rounded-lg">
                    <div className="w-1 h-12 bg-primary rounded-full" />
                    <div>
                      <div className="font-medium">Global Climate Network</div>
                      <div className="text-sm text-muted-foreground">Interconnected climate monitoring stations worldwide</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-background rounded-lg">
                    <div className="w-1 h-12 bg-primary rounded-full" />
                    <div>
                      <div className="font-medium">Predictive System</div>
                      <div className="text-sm text-muted-foreground">Real-time climate prediction with quantum computing</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-background rounded-lg">
                    <div className="w-1 h-12 bg-primary rounded-full" />
                    <div>
                      <div className="font-medium">Universal Platform</div>
                      <div className="text-sm text-muted-foreground">Free access to climate data for all organizations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
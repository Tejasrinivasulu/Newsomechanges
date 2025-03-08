import React from 'react';
import {
  BookOpen,
  Database,
  Users,
  GraduationCap,
  ExternalLink,
  Calculator,
  BarChart2,
  Globe,
  TreePine,
  Wind,
  Droplets,
  Thermometer,
  Share2
} from 'lucide-react';

interface ResourceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  links: Array<{
    title: string;
    url: string;
    description: string;
    icon?: React.ElementType;
    metrics?: Array<{
      label: string;
      value: string;
      trend: 'up' | 'down' | 'neutral';
    }>;
  }>;
}

function ResourceCard({ icon: Icon, title, description, links }: ResourceCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg hover:bg-accent transition-colors group border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {link.icon && <link.icon className="w-5 h-5 text-primary" />}
                <span className="font-medium group-hover:text-primary transition-colors">{link.title}</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </div>
            <p className="text-sm text-muted-foreground">{link.description}</p>
            {link.metrics && (
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                {link.metrics.map((metric, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-lg font-semibold text-primary">{metric.value}</div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesSection() {
  const resources = [
    {
      icon: Calculator,
      title: "Interactive Climate Tools",
      description: "Powerful tools to analyze and understand climate change impacts.",
      links: [
        {
          icon: Globe,
          title: "Global Climate Explorer",
          url: "https://www.climate.gov/maps-data/climate-explorer",
          description: "Interactive map showing climate patterns, risks, and projections worldwide.",
          metrics: [
            { label: "Data Points", value: "1M+", trend: "up" },
            { label: "Regions", value: "200+", trend: "neutral" },
            { label: "Updates", value: "Daily", trend: "up" }
          ]
        },
        {
          icon: BarChart2,
          title: "Climate Impact Analyzer",
          url: "https://www.climateinteractive.org/tools/",
          description: "Analyze different climate scenarios and their potential impacts.",
          metrics: [
            { label: "Scenarios", value: "1000+", trend: "up" },
            { label: "Variables", value: "25+", trend: "up" },
            { label: "Years", value: "2100", trend: "neutral" }
          ]
        }
      ]
    },
    {
      icon: TreePine,
      title: "Ecosystem Analysis Tools",
      description: "Tools for understanding environmental changes and biodiversity impacts.",
      links: [
        {
          icon: TreePine,
          title: "Forest Cover Analyzer",
          url: "https://www.globalforestwatch.org/",
          description: "Track forest changes and deforestation patterns in real-time.",
          metrics: [
            { label: "Coverage", value: "Global", trend: "neutral" },
            { label: "Resolution", value: "30m", trend: "up" },
            { label: "Updates", value: "Weekly", trend: "up" }
          ]
        },
        {
          icon: Wind,
          title: "Air Quality Monitor",
          url: "https://www.iqair.com/air-quality-map",
          description: "Real-time air quality data and pollution tracking worldwide.",
          metrics: [
            { label: "Stations", value: "10K+", trend: "up" },
            { label: "Cities", value: "500+", trend: "up" },
            { label: "Accuracy", value: "98%", trend: "up" }
          ]
        }
      ]
    },
    {
      icon: Droplets,
      title: "Water & Ocean Tools",
      description: "Monitor water resources and ocean health indicators.",
      links: [
        {
          icon: Droplets,
          title: "Ocean Health Index",
          url: "http://www.oceanhealthindex.org/",
          description: "Comprehensive tool for assessing ocean ecosystem health.",
          metrics: [
            { label: "Indicators", value: "25+", trend: "up" },
            { label: "Regions", value: "220+", trend: "up" },
            { label: "Data Years", value: "30+", trend: "up" }
          ]
        },
        {
          icon: Thermometer,
          title: "Sea Level Predictor",
          url: "https://sealevel.nasa.gov/",
          description: "Track and predict sea level changes with NASA data.",
          metrics: [
            { label: "Accuracy", value: "±0.4mm", trend: "up" },
            { label: "Coverage", value: "Global", trend: "neutral" },
            { label: "Forecast", value: "2100", trend: "neutral" }
          ]
        }
      ]
    },
    {
      icon: Share2,
      title: "Educational Resources",
      description: "Interactive learning tools and visualizations for climate education.",
      links: [
        {
          icon: GraduationCap,
          title: "Climate Science Learning Lab",
          url: "https://scied.ucar.edu/learning-zone/climate-change-impacts",
          description: "Interactive modules and experiments for understanding climate science.",
          metrics: [
            { label: "Modules", value: "50+", trend: "up" },
            { label: "Activities", value: "100+", trend: "up" },
            { label: "Languages", value: "12", trend: "up" }
          ]
        },
        {
          icon: Globe,
          title: "Climate Time Machine",
          url: "https://climate.nasa.gov/interactives/climate-time-machine",
          description: "Visualize climate change over time with NASA's interactive tool.",
          metrics: [
            { label: "Time Span", value: "800K yrs", trend: "neutral" },
            { label: "Data Sets", value: "15+", trend: "up" },
            { label: "Resolution", value: "High", trend: "up" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="max-w-3xl mb-8">
          <h2 className="text-2xl font-bold mb-3">Climate Analysis Tools</h2>
          <p className="text-muted-foreground">
            Explore our collection of powerful, interactive tools for analyzing and understanding climate change. 
            These resources provide real-time data, predictions, and insights to help you make informed decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>
      </div>
    </div>
  );
}
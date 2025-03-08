import React, { useState } from 'react';
import { Home, BookOpen, Library, Database, Bell } from 'lucide-react';
import ClimateAIDashboard from './components/ClimateAIDashboard';
import ThemeToggle from './components/ThemeToggle';
import NotificationsPanel from './components/NotificationsPanel';
import AboutSection from './components/AboutSection';
import DatasetSection from './components/DatasetSection';
import ResourcesSection from './components/ResourcesSection';
import { Alert } from './components/AlertSystem/types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Alert[]>([
    {
      id: '1',
      title: 'Temperature Alert',
      message: 'Significant temperature increase detected in Asia region',
      severity: 'high',
      timestamp: new Date(),
      status: 'active',
      kpi: 'temperature',
      value: 2.5,
      threshold: 2.0,
      region: 'Asia'
    }
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary">ClimateAI Predictor</h1>
              <NavItem
                icon={Home}
                label="Home"
                active={activeSection === 'home'}
                onClick={() => setActiveSection('home')}
              />
              <NavItem
                icon={BookOpen}
                label="About"
                active={activeSection === 'about'}
                onClick={() => setActiveSection('about')}
              />
              <NavItem
                icon={Database}
                label="Datasets"
                active={activeSection === 'datasets'}
                onClick={() => setActiveSection('datasets')}
              />
              <NavItem
                icon={Library}
                label="Resources"
                active={activeSection === 'resources'}
                onClick={() => setActiveSection('resources')}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <NotificationsPanel
                      alerts={notifications}
                      onDismiss={(id) => setNotifications(notifications.filter(n => n.id !== id))}
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeSection === 'home' && <ClimateAIDashboard />}
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'datasets' && <DatasetSection />}
        {activeSection === 'resources' && <ResourcesSection />}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About ClimateAI Predictor</h3>
              <p className="text-muted-foreground text-sm">
                ClimateAI Predictor is a cutting-edge platform that combines artificial intelligence with climate science
                to provide accurate predictions and insights about climate change impacts worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
              <p className="text-muted-foreground text-sm">
                Our predictions are based on comprehensive data from leading climate research institutions, including
                satellite observations, weather stations, and ocean monitoring systems.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-muted-foreground text-sm">
            © 2025 ClimateAI Predictor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
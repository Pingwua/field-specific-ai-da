import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Server, 
  Database, 
  ShieldCheck, 
  Lifebuoy,
  Download,
  Globe,
  Lock
} from '@phosphor-icons/react';
import { marked } from 'marked';

const DeploymentGuide = () => {
  const [guideContent, setGuideContent] = useState('');
  
  useEffect(() => {
    fetch('/src/docs/deployment-guide.md')
      .then(response => response.text())
      .then(text => {
        setGuideContent(marked.parse(text));
      })
      .catch(error => {
        console.error('Error loading deployment guide:', error);
        setGuideContent('<p>Error loading deployment guide. Please try again later.</p>');
      });
  }, []);

  const downloadGuide = () => {
    const element = document.createElement('a');
    const file = new Blob([guideContent.replace(/<[^>]*>?/gm, '')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'ai-data-refiner-deployment-guide.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Globe size={24} className="mr-2" /> 
          Deployment Guide
        </CardTitle>
        <CardDescription>
          Step-by-step instructions for deploying the AI Data Refiner application on Ubuntu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <Monitor className="mr-2" size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="server">
              <Server className="mr-2" size={16} />
              Server Setup
            </TabsTrigger>
            <TabsTrigger value="app">
              <Database className="mr-2" size={16} />
              Application Setup
            </TabsTrigger>
            <TabsTrigger value="security">
              <ShieldCheck className="mr-2" size={16} />
              Security
            </TabsTrigger>
            <TabsTrigger value="support">
              <Lifebuoy className="mr-2" size={16} />
              Support
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-4 border rounded-lg">
            <div className="mb-4">
              <p className="mb-4">
                This guide will help you deploy the AI Data Refiner application to an Ubuntu server.
                Follow these steps carefully to ensure a successful deployment.
              </p>
              <p>
                The deployment process consists of:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Setting up an Ubuntu server</li>
                <li>Installing required dependencies</li>
                <li>Configuring the web server</li>
                <li>Securing your application with SSL</li>
                <li>Testing and maintaining your deployment</li>
              </ul>
            </div>
            <Button onClick={downloadGuide} className="mt-4">
              <Download className="mr-2" size={16} />
              Download Complete Guide
            </Button>
          </TabsContent>
          
          <TabsContent value="server" className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: guideContent.includes('Step 1:') ? 
                guideContent.split('Step 2:')[0] : 
                '<p>Loading server setup instructions...</p>' 
            }} />
          </TabsContent>
          
          <TabsContent value="app" className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: guideContent.includes('Step 2:') ? 
                guideContent.substring(
                  guideContent.indexOf('Step 2:'),
                  guideContent.indexOf('Step 6:')
                ) : 
                '<p>Loading application setup instructions...</p>' 
            }} />
          </TabsContent>
          
          <TabsContent value="security" className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: guideContent.includes('Step 6:') ? 
                guideContent.substring(
                  guideContent.indexOf('Step 6:'),
                  guideContent.indexOf('Step 8:')
                ) : 
                '<p>Loading security instructions...</p>' 
            }} />
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <Lock size={20} className="mr-2" />
                Security Best Practices
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Always keep your server and packages updated</li>
                <li>Use strong passwords for all services</li>
                <li>Implement proper firewall rules</li>
                <li>Use HTTPS with valid SSL certificates</li>
                <li>Set up regular backups of your application</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="support" className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: guideContent.includes('Troubleshooting') ? 
                guideContent.substring(
                  guideContent.indexOf('Troubleshooting')
                ) : 
                '<p>Loading support information...</p>' 
            }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeploymentGuide;
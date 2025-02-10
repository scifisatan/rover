import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateWebsiteForm } from "@/components/website-form/CreateWebsiteForm";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useSupabaseAuth();
  const navigate = useNavigate()

  const { data: websites, isLoading, refetch } = useQuery({
    queryKey: ['websites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Create Your Website</h1>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
          
          <CreateWebsiteForm onFormCompletion={setIsCreating} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Websites</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Website
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
            </Card>
          ) : websites && websites.length > 0 ? (
            websites.map((website) => (
            
              <Card onClick={()=>{navigate('/'+website.business_name)}} key={website.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{website.business_name}</CardTitle>
                  {website.tagline && (
                    <CardDescription>{website.tagline}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {website.description && (
                    <p className="text-sm text-muted-foreground mb-4">{website.description}</p>
                  )}
                  <div className="space-y-2">
                    {website.contact_email && (
                      <p className="text-sm">Email: {website.contact_email}</p>
                    )}
                    {website.contact_phone && (
                      <p className="text-sm">Phone: {website.contact_phone}</p>
                    )}
                    {website.address && (
                      <p className="text-sm">Address: {website.address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
          
            ))
          ) : (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Create Your First Website</CardTitle>
                <CardDescription>
                  Get started by creating your first business website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Website
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

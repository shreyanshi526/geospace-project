import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Site } from "@/features/sites/api/sitesAPI";
import park from '@/assets/park.jpg'

interface SiteCardProps {
  site: Site;
  onViewAnalytics?: (site: Site) => void;
  extraContent?: ReactNode;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onViewAnalytics,
  extraContent,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>(); 
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">

      <img
        src={
          park
        }
        alt={site.name}
        className="w-full h-40 object-cover"
      />

      <CardContent className="p-4 flex flex-col">
        {/* Title + Description */}
        <h2 className="text-lg font-semibold text-gray-800">{site.name}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {site.description}
        </p>

        {/* Metadata */}
        <div className="mt-3 text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium">ID:</span> {site.id}
          </p>
          {site.location && (
            <p>
              <span className="font-medium">Location:</span> {site.location}
            </p>
          )}
        </div>

        {extraContent && <div className="mt-3">{extraContent}</div>}

        {onViewAnalytics && (
          <Button
            className="mt-4 w-full"
            onClick={() =>
              navigate(
                `/projects/${projectId || site.project_id}/sites/${site.id}/analytics`
              )
            }
          >
            View Analytics
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

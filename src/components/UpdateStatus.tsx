
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface UpdateStatusProps {
  lastUpdate: Date | null;
  isLoading: boolean;
  error: string | null;
  className?: string;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({ 
  lastUpdate, 
  isLoading, 
  error, 
  className 
}) => {
  const getStatusColor = () => {
    if (error) return 'destructive';
    if (isLoading) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isLoading) return 'Actualizando...';
    if (lastUpdate) {
      return `Actualizado ${formatDistanceToNow(lastUpdate, { 
        addSuffix: true, 
        locale: es 
      })}`;
    }
    return 'Sin datos';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={getStatusColor()} className="text-xs">
            {getStatusText()}
          </Badge>
          {error && (
            <p className="text-xs text-muted-foreground mt-1">
              {error}
            </p>
          )}
        </div>
        
        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>WRF Córdoba:</span>
            <span>06:00 y 18:00 UTC</span>
          </div>
          <div className="flex justify-between">
            <span>Calidad del Aire:</span>
            <span>10:30 diario</span>
          </div>
          <div className="flex justify-between">
            <span>Incendios/Vientos:</span>
            <span>11:00 diario</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdateStatus;

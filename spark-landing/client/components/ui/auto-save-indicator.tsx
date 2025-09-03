import React from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Save,
  RotateCcw,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  onManualSave?: () => void;
  onRecoverData?: () => void;
  onClearAutoSave?: () => void;
  onToggleAutoSave?: () => void;
  className?: string;
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  hasUnsavedChanges,
  autoSaveEnabled,
  onManualSave,
  onRecoverData,
  onClearAutoSave,
  onToggleAutoSave,
  className
}: AutoSaveIndicatorProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getStatusIcon = () => {
    if (isSaving) return <RefreshCw className="w-3 h-3 animate-spin" />;
    if (lastSaved && !hasUnsavedChanges) return <CheckCircle className="w-3 h-3" />;
    if (hasUnsavedChanges) return <Clock className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  const getStatusText = () => {
    if (isSaving) return 'Saving...';
    if (lastSaved && !hasUnsavedChanges) return `Saved ${formatTimeAgo(lastSaved)}`;
    if (hasUnsavedChanges) return 'Unsaved changes';
    return 'Not saved';
  };

  const getStatusVariant = () => {
    if (isSaving) return 'secondary';
    if (lastSaved && !hasUnsavedChanges) return 'default';
    if (hasUnsavedChanges) return 'destructive';
    return 'secondary';
  };

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      {/* Auto-save Status */}
      <Badge variant={getStatusVariant()} className="flex items-center gap-1">
        {getStatusIcon()}
        {getStatusText()}
      </Badge>

      {/* Auto-save Toggle */}
      {onToggleAutoSave && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAutoSave}
          className="h-6 px-2 text-xs"
        >
          {autoSaveEnabled ? 'Auto-save ON' : 'Auto-save OFF'}
        </Button>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {onManualSave && hasUnsavedChanges && (
          <Button
            variant="outline"
            size="sm"
            onClick={onManualSave}
            className="h-6 px-2 text-xs"
            disabled={isSaving}
          >
            <Save className="w-3 h-3 mr-1" />
            Save Now
          </Button>
        )}

        {onRecoverData && lastSaved && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRecoverData}
            className="h-6 px-2 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Recover
          </Button>
        )}

        {onClearAutoSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAutoSave}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}


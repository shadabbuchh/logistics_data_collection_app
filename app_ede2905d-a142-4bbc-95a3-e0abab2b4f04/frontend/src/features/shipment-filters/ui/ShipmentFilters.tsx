import { useShipmentFiltersStore } from '../model/store';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@/shared/ui';
import { Search, X } from 'lucide-react';

export const ShipmentFilters = () => {
  const filters = useShipmentFiltersStore(state => state.filters);
  const setFilter = useShipmentFiltersStore(state => state.setFilter);
  const clearFilters = useShipmentFiltersStore(state => state.clearFilters);

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shipments..."
            value={filters.search || ''}
            onChange={e => setFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select
        value={filters.status || ''}
        onValueChange={value => setFilter('status', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-transit">In Transit</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="exception">Exception</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority || ''}
        onValueChange={value => setFilter('priority', value)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.timeWindow || ''}
        onValueChange={value => setFilter('timeWindow', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Time Window" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="tomorrow">Tomorrow</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};

import React from 'react'
import { Search, Filter, X, Calendar } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from './ui/popover'
import { Label } from './ui/label'

export const SearchAndFilter: React.FC = () => {
  const {
    searchQuery,
    filterType,
    filterDateRange,
    filterCategory,
    categories,
    setSearchQuery,
    setFilterType,
    setFilterDateRange,
    setFilterCategory,
    clearFilters
  } = useAppStore()

  const hasActiveFilters = searchQuery || filterType !== 'all' || filterDateRange || filterCategory

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Type Filter */}
        <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'income' | 'expense')}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={filterCategory || 'all'} onValueChange={(value) => setFilterCategory(value === 'all' ? null : value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filterDateRange?.start || ''}
                  onChange={(e) => setFilterDateRange({
                    start: e.target.value,
                    end: filterDateRange?.end || e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filterDateRange?.end || ''}
                  onChange={(e) => setFilterDateRange({
                    start: filterDateRange?.start || e.target.value,
                    end: e.target.value
                  })}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterDateRange(null)}
                className="w-full"
              >
                Clear Date Range
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

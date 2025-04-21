import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResourceItem from '../components/ResourceItem';
import debounce from 'lodash.debounce';
import FilterListIcon from '@mui/icons-material/FilterList';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    resourceType: '',
    premiType: '',
    capacity: '',
    isAC: '',
    hasWhiteboard: '',
    hasProjector: '',
    hasDesktopOrLaptop: '',
    hasMicrophone: '',
    assetType: '',
    brand: '',
    model: '',
  });

  // Fetch resources whenever filters or searchTerm change
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/resource/get', {
          params: {
            ...filters,
            searchTerm,
          },
        });
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filters, searchTerm]);

  // Debounced fetch for search input
  const debouncedFetchResources = debounce(async (searchQuery, filters) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/resource/get`, {
        params: { searchTerm: searchQuery, ...filters },
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchResources(value, filters);
  };

  const handleFilterIconClick = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    debouncedFetchResources(searchTerm, filters);
    setIsFilterDropdownOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      resourceType: '',
      premiType: '',
      capacity: '',
      isAC: '',
      hasWhiteboard: '',
      hasProjector: '',
      hasDesktopOrLaptop: '',
      hasMicrophone: '',
      assetType: '',
      brand: '',
      model: '',
    });
    setSearchTerm('');
    debouncedFetchResources('', {
      resourceType: '',
      premiType: '',
      capacity: '',
      isAC: '',
      hasWhiteboard: '',
      hasProjector: '',
      hasDesktopOrLaptop: '',
      hasMicrophone: '',
      assetType: '',
      brand: '',
      model: '',
    });
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-center mt-1 mb-10 text-4xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-black">
        Resources
      </h1>
      <div className="relative mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <FilterListIcon
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleFilterIconClick}
        />
        {isFilterDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
            <div className="p-4">
              <label className="block text-gray-700">Type</label>
              <select
                name="resourceType"
                value={filters.resourceType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All</option>
                <option value="PremisesResourceType">Premises Resource</option>
                <option value="AssetResourceType">Asset Resource</option>
              </select>
            </div>
            {filters.resourceType === 'PremisesResourceType' && (
              <>
                <div className="p-4">
                  <label className="block text-gray-700">Premises Type</label>
                  <select
                    name="premiType"
                    value={filters.premiType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="Lecture Room">Lecture Room</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Mini Auditorium">Mini Auditorium</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Discussion Room">Discussion Room</option>
                  </select>
                </div>
                <div className="p-4">
                  <label className="block text-gray-700">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={filters.capacity}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div className="p-4">
                  <label className="block text-gray-700">Air Conditioning</label>
                  <select
                    name="isAC"
                    value={filters.isAC}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="p-4">
                  <label className="block text-gray-700">Has Whiteboard</label>
                  <select
                    name="hasWhiteboard"
                    value={filters.hasWhiteboard}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="p-4">
                  <label className="block text-gray-700">Has Projector</label>
                  <select
                    name="hasProjector"
                    value={filters.hasProjector}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </>
            )}
            {filters.resourceType === 'AssetResourceType' && (
              <>
                <div className="p-4">
                  <label className="block text-gray-700">Asset Type</label>
                  <select
                    name="assetType"
                    value={filters.assetType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Projector">Projector</option>
                    <option value="Microphone">Microphone</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Camera">Camera</option>
                  </select>
                </div>
                <div className="p-4">
                  <label className="block text-gray-700">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div className="p-4">
                  <label className="block text-gray-700">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={filters.model}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </>
            )}
            <div className="p-4 flex justify-between">
              <button
                onClick={handleApplyFilters}
                className="bg-blue-500 text-white rounded-lg py-2 px-4 font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-gray-300 text-black rounded-lg py-2 px-4 font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <p className="text-blue-500">Loading resources...</p>
      ) : (
        resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map(resource => (
              <ResourceItem key={resource._id} resource={resource} />
            ))}
          </div>
        ) : (
          <p className="text-red-700 mt-5">No resources found.</p>
        )
      )}
    </div>
  );
};

export default Resources;
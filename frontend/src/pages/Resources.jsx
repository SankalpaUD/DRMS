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
    type: '',
    availability: '',
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('/api/resource/get');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

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
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
            <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Type</label>
              <input
                type="text"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Availability</label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
              Apply Filters
            </button>
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
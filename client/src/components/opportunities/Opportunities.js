import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  Pagination,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  Work as WorkIcon,
  FilterList as FilterIcon,
} from '@material-ui/icons';
import { getOpportunities } from '../../actions/opportunityActions';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  searchContainer: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  searchInput: {
    marginBottom: theme.spacing(2),
  },
  filtersContainer: {
    marginTop: theme.spacing(2),
  },
  filter: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: theme.spacing(2),
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    '& svg': {
      marginRight: theme.spacing(1),
      fontSize: '1.1rem',
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
}));

const Opportunities = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { opportunities, loading } = useSelector((state) => state.opportunities);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    location: '',
    sortBy: 'newest',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 9,
  });

  useEffect(() => {
    dispatch(getOpportunities(filters));
  }, [dispatch, filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, page: value });
    window.scrollTo(0, 0);
  };

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch = opportunity.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesType =
      filters.type === 'all' || opportunity.type === filters.type;
    const matchesLocation = filters.location
      ? opportunity.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      : true;

    return matchesSearch && matchesType && matchesLocation;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  });

  const indexOfLastItem = pagination.page * pagination.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
  const currentItems = sortedOpportunities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Opportunities
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Browse and apply for attachment and internship opportunities from top companies.
        </Typography>
      </Box>

      <Box className={classes.searchContainer}>
        <TextField
          className={classes.searchInput}
          fullWidth
          variant="outlined"
          placeholder="Search opportunities by title, company, or keywords..."
          value={filters.search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box className={classes.filtersContainer}>
          <FormControl variant="outlined" className={classes.filter} size="small">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="attachment">Attachment</MenuItem>
              <MenuItem value="internship">Internship</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.filter} size="small">
            <InputLabel id="location-filter-label">Location</InputLabel>
            <Select
              labelId="location-filter-label"
              id="location-filter"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              label="Location"
            >
              <MenuItem value="">All Locations</MenuItem>
              <MenuItem value="Nairobi">Nairobi</MenuItem>
              <MenuItem value="Mombasa">Mombasa</MenuItem>
              <MenuItem value="Kisumu">Kisumu</MenuItem>
              <MenuItem value="Nakuru">Nakuru</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.filter} size="small">
            <InputLabel id="sort-filter-label">Sort By</InputLabel>
            <Select
              labelId="sort-filter-label"
              id="sort-filter"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              label="Sort By"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="deadline">Application Deadline</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : currentItems.length === 0 ? (
        <Box className={classes.noResults}>
          <Typography variant="h6" gutterBottom>
            No opportunities found
          </Typography>
          <Typography variant="body2">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentItems.map((opportunity) => (
              <Grid item key={opportunity._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Box display="flex" alignItems="center" mb={2}>
                      {opportunity.company?.logo ? (
                        <img
                          src={opportunity.company.logo}
                          alt={opportunity.company.name}
                          className={classes.companyLogo}
                        />
                      ) : (
                        <BusinessIcon
                          className={classes.companyLogo}
                          style={{ fontSize: 60, color: '#757575' }}
                        />
                      )}
                      <Box ml={2}>
                        <Typography variant="h6" component="h2">
                          {opportunity.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          gutterBottom
                        >
                          {opportunity.company?.name || 'Company Name'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Chip
                        label={opportunity.type}
                        color="primary"
                        variant="outlined"
                        size="small"
                        className={classes.chip}
                      />
                      <Chip
                        label={opportunity.duration}
                        variant="outlined"
                        size="small"
                        className={classes.chip}
                      />
                    </Box>

                    <Typography variant="body2" paragraph>
                      {opportunity.description.length > 150
                        ? `${opportunity.description.substring(0, 150)}...`
                        : opportunity.description}
                    </Typography>

                    <Box mt="auto">
                      <Divider style={{ margin: '16px 0' }} />
                      <Box className={classes.metaInfo}>
                        <LocationIcon fontSize="small" />
                        <Typography variant="body2">
                          {opportunity.location}
                        </Typography>
                      </Box>
                      <Box className={classes.metaInfo}>
                        <EventIcon fontSize="small" />
                        <Typography variant="body2">
                          Apply by:{' '}
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/opportunities/${opportunity._id}`}
                      color="primary"
                      fullWidth
                      variant="outlined"
                      startIcon={<WorkIcon />}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredOpportunities.length > pagination.itemsPerPage && (
            <Box className={classes.pagination}>
              <Pagination
                count={Math.ceil(
                  filteredOpportunities.length / pagination.itemsPerPage
                )}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Opportunities;

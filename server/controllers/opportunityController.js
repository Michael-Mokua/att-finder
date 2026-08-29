const Opportunity = require('../models/Opportunity');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new opportunity
exports.createOpportunity = catchAsync(async (req, res, next) => {
  const opportunity = await Opportunity.create({
    ...req.body,
    company: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      opportunity
    }
  });
});

// Get all opportunities with filtering, sorting, and pagination
exports.getAllOpportunities = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Search functionality
  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  // Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = Opportunity.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const total = await Opportunity.countDocuments(query);
  const opportunities = await query.skip(skip).limit(limit);

  res.status(200).json({
    status: 'success',
    results: opportunities.length,
    total,
    data: {
      opportunities
    }
  });
});

// Get a single opportunity
exports.getOpportunity = catchAsync(async (req, res, next) => {
  const opportunity = await Opportunity.findById(req.params.id)
    .populate('company', 'name profilePicture')
    .populate('applications.student', 'name email school course');

  if (!opportunity) {
    return next(new AppError('No opportunity found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      opportunity
    }
  });
});

// Update an opportunity
exports.updateOpportunity = catchAsync(async (req, res, next) => {
  // Check if the user is the owner of the opportunity
  const opportunity = await Opportunity.findOne({
    _id: req.params.id,
    company: req.user._id
  });

  if (!opportunity) {
    return next(new AppError('No opportunity found with that ID or you do not have permission to perform this action', 404));
  }

  const updatedOpportunity = await Opportunity.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      opportunity: updatedOpportunity
    }
  });
});

// Delete an opportunity
exports.deleteOpportunity = catchAsync(async (req, res, next) => {
  const opportunity = await Opportunity.findOneAndDelete({
    _id: req.params.id,
    company: req.user._id
  });

  if (!opportunity) {
    return next(new AppError('No opportunity found with that ID or you do not have permission to perform this action', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Apply for an opportunity
exports.applyForOpportunity = catchAsync(async (req, res, next) => {
  // Check if user is a student
  if (req.user.role !== 'student') {
    return next(new AppError('Only students can apply for opportunities', 400));
  }

  const opportunity = await Opportunity.findById(req.params.id);
  
  if (!opportunity) {
    return next(new AppError('No opportunity found with that ID', 404));
  }

  // Check if already applied
  const alreadyApplied = opportunity.applications.some(
    app => app.student.toString() === req.user._id.toString()
  );

  if (alreadyApplied) {
    return next(new AppError('You have already applied for this opportunity', 400));
  }

  // Add application
  opportunity.applications.push({
    student: req.user._id,
    coverLetter: req.body.coverLetter || ''
  });

  await opportunity.save();

  res.status(200).json({
    status: 'success',
    message: 'Application submitted successfully'
  });
});

// Update application status (for companies)
exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { id, applicationId } = req.params;

  const opportunity = await Opportunity.findOne({
    _id: id,
    company: req.user._id
  });

  if (!opportunity) {
    return next(new AppError('No opportunity found with that ID or you do not have permission to perform this action', 404));
  }

  const application = opportunity.applications.id(applicationId);
  if (!application) {
    return next(new AppError('No application found with that ID', 404));
  }

  application.status = status;
  await opportunity.save();

  res.status(200).json({
    status: 'success',
    message: 'Application status updated successfully'
  });
});

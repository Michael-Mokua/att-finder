const express = require('express');
const opportunityController = require('../controllers/opportunityController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes (no authentication required)
router
  .route('/')
  .get(opportunityController.getAllOpportunities);

router
  .route('/:id')
  .get(opportunityController.getOpportunity);

// Protect all routes after this middleware
export const protect = (req, res, next) => {
  // Implementation of protect middleware
  next();
};

router.use(authController.protect);

// Routes that require authentication
router.post('/:id/apply', opportunityController.applyForOpportunity);

// Routes that require company role
router.use(authController.restrictTo('company'));

router
  .route('/')
  .post(opportunityController.createOpportunity);

router
  .route('/:id')
  .patch(opportunityController.updateOpportunity)
  .delete(opportunityController.deleteOpportunity);

router.patch(
  '/:id/applications/:applicationId',
  opportunityController.updateApplicationStatus
);

module.exports = router;

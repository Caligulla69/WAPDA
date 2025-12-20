const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local"). Strategy;

const Engineer = require('../models/Users');
const DepartmentalUser = require('../models/Emp');
const ReportModel = require("../models/Report");


// -----------------------------
// 🏠 BASIC ROUTE
// -----------------------------
router.get("/", (req, res) => {
  res.json({ message: "Welcome to WAPDA Troubleshooting Report System API 🚀" });
});

// -----------------------------
// 👤 AUTH ROUTES
// -----------------------------

// Engineer Registration
router.post("/engineer/register", async (req, res) => {
  try {
    const { name, email, password, department, phoneNumber, role } = req.body;

    const existingEngineer = await Engineer. findOne({ email });
    if (existingEngineer)
      return res.status(400).json({ message: "Email already registered" });

    const newEngineer = new Engineer({ 
      name, 
      email, 
      department,
      phoneNumber,
      role: role || 'shift_engineer'
    });
    
    await Engineer.register(newEngineer, password);

    // ✅ FIX: Use correct strategy name
    passport.authenticate("engineer-local")(req, res, () => {
      const safeUser = {
        _id: newEngineer._id,
        name: newEngineer.name,
        email: newEngineer.email,
        department: newEngineer.department,
        role: newEngineer.role,
        userType: 'engineer'
      };
      res.status(201).json({ message: "Registration successful", user: safeUser });
    });
  } catch (error) {
    console.error("Engineer registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Engineer Login
router.post("/engineer/login", (req, res, next) => {
  // ✅ FIX: Use correct strategy name
  passport.authenticate("engineer-local", (err, user, info) => {
    if (err) return next(err);
    if (! user)
      return res.status(401).json({ message: info?. message || "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);

      req.session.save((saveErr) => {
        if (saveErr)
          return res.status(500).json({ message: "Session creation failed" });

        const safeUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          userType: 'engineer'
        };

        res.status(200).json({
          message: "Login successful",
          user: safeUser,
        });
      });
    });
  })(req, res, next);
});

// Departmental User Registration
router.post("/department/register", async (req, res) => {
  try {
    const { name, employeeId, password, department, phoneNumber, email } = req.body;

    const existingUser = await DepartmentalUser. findOne({ employeeId });
    if (existingUser)
      return res.status(400). json({ message: "Employee ID already registered" });

    const newUser = new DepartmentalUser({ 
      name, 
      employeeId,
      email, // Optional
      department,
      phoneNumber,
      role: 'department'
    });
    
    await DepartmentalUser. register(newUser, password);

    // ✅ FIX: Use correct strategy name
    passport.authenticate("departmental-local")(req, res, () => {
      const safeUser = {
        _id: newUser._id,
        name: newUser.name,
        employeeId: newUser.employeeId,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
        userType: 'departmental'
      };
      res.status(201).json({ message: "Registration successful", user: safeUser });
    });
  } catch (error) {
    console. error("Departmental registration error:", error);
    res. status(500).json({ message: "Server error during registration" });
  }
});

// Departmental User Login
router.post("/department/login", (req, res, next) => {
  // ✅ FIX: Use correct strategy name
  passport. authenticate("departmental-local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: info?. message || "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);

      req.session.save((saveErr) => {
        if (saveErr)
          return res.status(500).json({ message: "Session creation failed" });

        const safeUser = {
          _id: user._id,
          name: user.name,
          employeeId: user. employeeId,
          email: user.email,
          department: user.department,
          role: user.role,
          userType: 'departmental'
        };

        res.status(200).json({
          message: "Login successful",
          user: safeUser,
        });
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req. logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("wapda_session", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// ✅ FIX: Check both models based on user type
router.get("/userData", isLoggedIn, async (req, res) => {
  try {
    let user;
    
    // Check if user has employeeId (departmental) or email (engineer)
    if (req.user.employeeId) {
      user = await DepartmentalUser.findById(req.user._id);
    } else {
      user = await Engineer.findById(req.user._id);
    }
    
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// ✅ FIX: Include userType and handle both
router.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    const safeUser = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      employeeId: req.user.employeeId, // May be undefined for engineers
      department: req.user. department,
      role: req. user.role,
      userType: req.user.employeeId ? 'departmental' : 'engineer'
    };
    res.json({ isLoggedIn: true, user: safeUser });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// ✅ FIX: Fetch from both collections or clarify purpose
router.get("/users", isLoggedIn, async (req, res) => {
  try {
    // Fetch both types of users
    const engineers = await Engineer.find(). select("-salt -hash");
    const departmentalUsers = await DepartmentalUser.find().select("-salt -hash");
    
    // Combine and add userType
    const allUsers = [
      ...engineers. map(u => ({ ...u. toObject(), userType: 'engineer' })),
      ...departmentalUsers.map(u => ({ ...u.toObject(), userType: 'departmental' }))
    ];
    
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res. status(500).json({ message: "Error fetching users" });
  }
});

// -----------------------------
// 📋 REPORT ROUTES
// -----------------------------

// Create new report (Shift Engineer)
router.post("/createReport", isLoggedIn, async (req, res) => {
  try {
    const {
      serialNo,
      date,
      time,
      apparatus,
      description,
      recommendation,
      operationAction,
      referTo,
      means,
    } = req.body;

    // Validation
    if (!serialNo || ! apparatus || !description) {
      return res.status(400).json({ 
        message: "Serial No, Apparatus, and Description are required" 
      });
    }

    // Check if serial number already exists
    const existingReport = await ReportModel.findOne({ serialNo });
    if (existingReport) {
      return res.status(400).json({ 
        message: "Serial number already exists" 
      });
    }

    const report = new ReportModel({
      serialNo,
      date: date || new Date(). toISOString(). split('T')[0],
      time: time || new Date().toTimeString().split(' ')[0]. substring(0, 5),
      apparatus,
      description,
      recommendation,
      operationAction,
      notifiedBy: req.user.name,
      referTo: referTo,
      means: means || 'Telephone',
      status: 'Pending',
      currentStage: 'Department',
      createdBy: req.user._id,
      remarks: []
    });

    await report. save();

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ 
      message: "Error creating report", 
      error: error. message 
    });
  }
});


// Update report (Add department action and send to OE)
router.put("/reports/:id/department-action", isLoggedIn, async (req, res) => {
  try {
    const { departmentAction } = req.body;

    console.log("📋 Department action request:", {
      reportId: req.params.id,
      user: req.user.name,
      department: req.user.department,
    });

    if (!departmentAction || ! departmentAction.trim()) {
      return res.status(400).json({
        message: "Department action is required",
      });
    }

    const report = await ReportModel.findById(req. params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Verify user is from the correct department
    if (req.user.department !== report.referTo) {
      return res. status(403).json({
        message: "You can only update reports assigned to your department",
      });
    }

    // Verify report is at Department stage
    if (report.currentStage !== "Department") {
      return res.status(400).json({
        message: `Report is currently at ${report.currentStage} stage and cannot be modified`,
      });
    }

    // Update report
    report.departmentAction = departmentAction. trim();
    report.status = "Under Review";
    report.currentStage = "OE Department";
    
    report.remarks.push({
      user: `${req.user.name} (${req.user.department})`,
      text: `Department action submitted: ${departmentAction. trim()}.  Report forwarded to OE Department for verification.`,
      timestamp: new Date(). toISOString(),
    });

    await report.save();

    console.log("✅ Report sent to OE:", report. serialNo);

    res.json({
      message: "Department action added and report sent to OE successfully",
      report,
    });
  } catch (error) {
    console.error("❌ Error updating report:", error);
    res.status(500).json({
      message: "Error updating report",
      error: error.message,
    });
  }
});

// Get all reports
router.get("/reports", isLoggedIn, async (req, res) => {
  try {
    const { role, department } = req. user;
    let query = {};

    // Filter based on role
    if (role === 'department') {
      // Use $in to check if the user's department is in the referTo array
      query. referTo = { $in: [department] };
      query.currentStage = 'Department';
      query.status = { $nin: ['Closed'] };
    } else if (role === 'oe') {
      query.currentStage = 'OE Department';
      query.status = { $nin: ['Closed'] };
    } else if (role === 'resident_engineer') {
      query.currentStage = 'Resident Engineer';
    }
    // shift_engineer and admin can see all reports

    const reports = await ReportModel.find(query)
      .sort({ createdAt:  -1 })
      .populate('createdBy', 'name email');

    res.json(reports);
  } catch (error) {
    console. error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// Get single report
router.get("/reports/:id", isLoggedIn, async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Error fetching report" });
  }
});

// Update report (Add department action)
router.put("/reports/:id/department-action", isLoggedIn, async (req, res) => {
  try {
    const { departmentAction } = req.body;

    if (!departmentAction) {
      return res.status(400).json({ 
        message: "Department action is required" 
      });
    }

    const report = await ReportModel. findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Verify user is from the correct department
    if (req.user.department !== report.referTo) {
      return res. status(403).json({ 
        message: "You can only update reports assigned to your department" 
      });
    }

    report.departmentAction = departmentAction;
    report.status = 'Under Review';
    report.currentStage = 'OE Department';
    report.remarks.push({
      user: req.user. name,
      text: `Department action submitted: ${departmentAction}`,
      timestamp: new Date(). toISOString(),
    });

    await report. save();

    res.json({
      message: "Department action added successfully",
      report,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ 
      message: "Error updating report", 
      error: error. message 
    });
  }
});

// Add remark to report
router.post("/reports/:id/remarks", isLoggedIn, async (req, res) => {
  try {
    const { text } = req. body;

    if (!text) {
      return res.status(400).json({ message: "Remark text is required" });
    }

    const report = await ReportModel.findById(req. params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.remarks.push({
      user: req.user.name,
      text,
      timestamp: new Date(). toISOString(),
    });

    await report.save();

    res.json({
      message: "Remark added successfully",
      report,
    });
  } catch (error) {
    console.error("Error adding remark:", error);
    res. status(500).json({ message: "Error adding remark" });
  }
});

// OE Department actions (approve/reject/refer)
router.put("/reports/:id/oe-action", isLoggedIn, async (req, res) => {
  try {
    const { action, department, remark } = req.body;
    // action can be: 'approve', 'reject', or 'refer'

    if (!action || !['approve', 'reject', 'refer'].includes(action)) {
      return res.status(400). json({ 
        message: "Valid action required (approve, reject, or refer)" 
      });
    }

    // Verify user is OE
    if (req.user.role !== 'oe') {
      return res.status(403). json({ 
        message: "Only OE Department can perform this action" 
      });
    }

    const report = await ReportModel.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Verify report is at OE stage
    if (report.currentStage !== 'OE Department') {
      return res.status(400).json({ 
        message: "Report is not at OE Department stage" 
      });
    }

    let remarkText = '';
    let newStatus = '';
    let newStage = '';

    switch (action) {
      case 'approve':
        // Approve and forward to Resident Engineer
        newStatus = 'Under Review';
        newStage = 'Resident Engineer';
        remarkText = 'Report verified and approved by OE Department.  Forwarded to Resident Engineer for final review.';
        break;

      case 'reject':
        // Reject and return to original department
        newStatus = 'Rejected';
        newStage = 'Department';
        remarkText = `Report rejected by OE Department and returned to ${report.referTo} department for revision.`;
        break;

      case 'refer':
        // Refer to another department
        if (! department) {
          return res. status(400).json({ 
            message: "Department is required for refer action" 
          });
        }

        newStatus = 'Pending';
        newStage = 'Department';
        
        // Update the referTo field to the new department
        report. referTo = department;
        
        remarkText = `Report referred to ${department} department for further action.`;
        break;

      default:
        return res. status(400).json({ message: "Invalid action" });
    }

    // Add custom remark if provided
    if (remark) {
      remarkText += ` - ${remark}`;
    }

    // Update report
    report.status = newStatus;
    report.currentStage = newStage;
    
    // Add remark to history
    report.remarks.push({
      user: req.user. name,
      text: remarkText,
      timestamp: new Date(). toISOString(),
    });

    await report.save();

    res.json({
      message: `Report ${action}ed successfully`,
      report,
    });
  } catch (error) {
    console.error("Error processing OE action:", error);
    res.status(500).json({ message: "Error processing action" });
  }
});

// Get reports pending for OE review
router.get("/reports/oe/pending", isLoggedIn, async (req, res) => {
  try {
    // Verify user is OE
    if (req.user.role !== 'oe') {
      return res.status(403).json({ 
        message: "Only OE Department can access this endpoint" 
      });
    }

    const reports = await ReportModel.find({
      currentStage: 'OE Department',
      status: { $nin: ['Closed'] }
    }). sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error("Error fetching OE reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// Add a remark to a report (OE can comment without taking action)
router.post("/reports/:id/oe-remark", isLoggedIn, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || ! text.trim()) {
      return res.status(400).json({ 
        message: "Remark text is required" 
      });
    }

    // Verify user is OE
    if (req.user.role !== 'oe') {
      return res.status(403).json({ 
        message: "Only OE Department can add remarks" 
      });
    }

    const report = await ReportModel.findById(req. params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Add remark
    report.remarks.push({
      user: req.user.name,
      text: text.trim(),
      timestamp: new Date(). toISOString(),
    });

    await report.save();

    res.json({
      message: "Remark added successfully",
      report,
    });
  } catch (error) {
    console.error("Error adding remark:", error);
    res. status(500).json({ message: "Error adding remark" });
  }
});

// Resident Engineer actions (close/reject/send back)
router.put("/reports/:id/resident-action", isLoggedIn, async (req, res) => {
  try {
    const { action, revisionReason } = req.body; // 'close', 'reject', or 'revision'

    if (!action || ! ['close', 'reject', 'revision'].includes(action)) {
      return res.status(400).json({ 
        message: "Valid action required (close, reject, or revision)" 
      });
    }

    // Verify user is Resident Engineer
    if (req.user.role !== 'resident_engineer') {
      return res.status(403).json({ 
        message: "Only Resident Engineer can perform this action" 
      });
    }

    const report = await ReportModel.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (action === 'close') {
      report.status = 'Closed';
      report.currentStage = 'Completed';
      report.remarks.push({
        user: req.user.name,
        text: 'Report verified and closed by Resident Engineer',
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'reject') {
      report. status = 'Rejected';
      report.currentStage = 'Completed';
      report. remarks.push({
        user: req.user.name,
        text: 'Report rejected by Resident Engineer',
        timestamp: new Date().toISOString(),
      });
    } else {
      if (!revisionReason) {
        return res.status(400). json({ 
          message: "Revision reason is required" 
        });
      }
      report.status = 'Needs Revision';
      report.currentStage = 'Department';
      report.remarks.push({
        user: req.user.name,
        text: `Sent back for revision: ${revisionReason}`,
        timestamp: new Date(). toISOString(),
      });
    }

    await report. save();

    res.json({
      message: `Report ${action} action completed successfully`,
      report,
    });
  } catch (error) {
    console.error("Error processing Resident Engineer action:", error);
    res.status(500).json({ message: "Error processing action" });
  }
});

// Get reports statistics
router.get("/reports/stats/summary", isLoggedIn, async (req, res) => {
  try {
    const totalReports = await ReportModel. countDocuments();
    const pendingReports = await ReportModel.countDocuments({ 
      status: 'Pending' 
    });
    const closedReports = await ReportModel.countDocuments({ 
      status: 'Closed' 
    });
    const rejectedReports = await ReportModel.countDocuments({ 
      status: 'Rejected' 
    });
    const underReview = await ReportModel.countDocuments({ 
      status: 'Under Review' 
    });

    res.json({
      totalReports,
      pendingReports,
      closedReports,
      rejectedReports,
      underReview,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500). json({ message: "Error fetching statistics" });
  }
});

// -----------------------------
// 🛡️ ADMIN ROUTES
// -----------------------------

// ✅ FIX: Handle both models in admin routes

// Get all users (Admin only)
router.get("/admin/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const engineers = await Engineer.find()
      .select("-salt -hash")
      .sort({ createdAt: -1 });
    
    const departmentalUsers = await DepartmentalUser.find()
      .select("-salt -hash")
      .sort({ createdAt: -1 });
    
    // Combine and mark user types
    const allUsers = [
      ...engineers.map(u => ({ ...u. toObject(), userType: 'engineer' })),
      ...departmentalUsers.map(u => ({ ...u.toObject(), userType: 'departmental' }))
    ];
    
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Create new user (Admin only) - Updated to handle both types
router.post("/admin/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { 
      username, 
      password, 
      role, 
      name, 
      email, 
      employeeId, 
      department, 
      userType // 'engineer' or 'departmental'
    } = req. body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (userType === 'departmental') {
      // Create departmental user
      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required for departmental users" });
      }

      const existingUser = await DepartmentalUser.findOne({ employeeId });
      if (existingUser) {
        return res.status(400).json({ message: "Employee ID already exists" });
      }

      const newUser = new DepartmentalUser({
        name: name || username,
        employeeId,
        email,
        department: department || 'General',
        role: role || 'department',
        status: 'active'
      });

      await DepartmentalUser.register(newUser, password);

      res.status(201).json({
        message: "Departmental user created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          employeeId: newUser.employeeId,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          status: newUser.status,
          userType: 'departmental'
        }
      });
    } else {
      // Create engineer user
      if (!email && !username) {
        return res.status(400).json({ message: "Email is required for engineers" });
      }

      const userEmail = email || `${username}@wapda.local`;
      const existingUser = await Engineer.findOne({ email: userEmail });
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new Engineer({
        name: name || username,
        email: userEmail,
        department: department || 'General',
        role: role || 'shift_engineer',
        status: 'active'
      });

      await Engineer.register(newUser, password);

      res.status(201).json({
        message: "Engineer user created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          status: newUser.status,
          userType: 'engineer'
        }
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res. status(500).json({ 
      message: "Error creating user", 
      error: error. message 
    });
  }
});

// Delete user (Admin only) - Updated to handle both types
router.delete("/admin/users/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ 
        message: "You cannot delete your own account" 
      });
    }

    // Try deleting from both collections
    let user = await Engineer.findByIdAndDelete(userId);
    let userType = 'engineer';
    
    if (! user) {
      user = await DepartmentalUser.findByIdAndDelete(userId);
      userType = 'departmental';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "User deleted successfully",
      deletedUser: {
        _id: user._id,
        name: user.name,
        email: user.email || undefined,
        employeeId: user.employeeId || undefined,
        userType
      }
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500). json({ message: "Error deleting user" });
  }
});

// Toggle user status (Admin only) - Updated to handle both types
router.put("/admin/users/:id/status", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { active } = req.body;
    const userId = req.params.id;

    console.log('Toggle status request:', { userId, active, body: req.body });

    // Validate active parameter
    if (typeof active !== 'boolean') {
      return res.status(400). json({ 
        message: "Invalid active status.  Must be true or false." 
      });
    }

    // Prevent admin from disabling themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ 
        message: "You cannot disable your own account" 
      });
    }

    // Convert boolean to status string
    const newStatus = active ? 'active' : 'disabled';

    // Try updating Engineer first
    let user = await Engineer. findByIdAndUpdate(
      userId,
      { status: newStatus },
      { new: true, runValidators: false }
    ). select("-salt -hash");

    let userType = 'engineer';

    // If not found, try DepartmentalUser
    if (!user) {
      user = await DepartmentalUser.findByIdAndUpdate(
        userId,
        { status: newStatus },
        { new: true, runValidators: false }
      ).select("-salt -hash");
      userType = 'departmental';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User status updated:', { userId: user._id, status: user. status, userType });

    res.json({
      message: `User ${active ? 'enabled' : 'disabled'} successfully`,
      user: {
        ... user.toObject(),
        userType
      }
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ 
      message: "Error updating user status",
      error: error.message 
    });
  }
});

// Get all reports (Admin override - see all reports)
router.get("/admin/reports", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const reports = await ReportModel. find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// Update report (Admin only)
router.put("/admin/reports/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const reportId = req.params.id;
    const updateData = req.body;

    // Remove fields that shouldn't be directly updated
    delete updateData._id;
    delete updateData. createdBy;
    delete updateData.createdAt;

    const report = await ReportModel.findByIdAndUpdate(
      reportId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Add admin edit remark
    report.remarks.push({
      user: `${req.user.name} (Admin)`,
      text: "Report edited by administrator",
      timestamp: new Date(). toISOString(),
    });

    await report.save();

    res.json({
      message: "Report updated successfully",
      report
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ 
      message: "Error updating report", 
      error: error.message 
    });
  }
});

// Delete report (Admin only)
router. delete("/admin/reports/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await ReportModel.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404). json({ message: "Report not found" });
    }

    res.json({
      message: "Report deleted successfully",
      deletedReport: {
        _id: report._id,
        serialNo: report.serialNo
      }
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Error deleting report" });
  }
});

// -----------------------------
// MIDDLEWARES
// -----------------------------
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized - Please login" });
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403). json({ message: "Access denied.  Admin privileges required." });
}

module.exports = router;
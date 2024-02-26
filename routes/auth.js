const express = require('express');
const router = express.Router();
const Enterprise = require('../Models_database/Company')
const Driver = require('../Models_database/Drivers')
const Orders = require('../Models_database/Orders')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "$ignedbyH@@rdSolanki"
const { body, validationResult } = require('express-validator');
const Order = require('../Models_database/Orders');
//Create an Enterprise using POST; /api/auth/
router.post('/createenterpriseuser',
    [body('name').trim().isLength({ min: 3 }).withMessage("Enter a valid name"),
    body('email').trim().isEmail().withMessage("enter valid email")
    ], async (req, res) => {
        console.log(req.body)

        //Group Errors if any and return bad request

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            console.log('Email from request:', req.body.email);

            let enterprise = await Enterprise.findOne({ email: req.body.email });
            if (enterprise) {
                return res.status(400).json({ error: "Your Enterprise already exists" })
            }
            const salt = await bcrypt.genSalt(10);
            secPass = await bcrypt.hash(req.body.password, salt);

            enterprise = await Enterprise.create({
                name: req.body.name,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                location: req.body.location,
                domainOfWork: req.body.domainOfWork,
                password: secPass,
            });
            const data = {
                enterprise: {
                    id: enterprise.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            // console.log(authtoken)
            res.json({ authtoken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    })

//Route 2 to add a driver into database
router.post('/createdriver', [
    body('name').trim().isLength({ min: 3 }).withMessage("Enter a valid name"),
    body('mobileNumber').trim().isLength({ min: 10, max: 10 }).isMobilePhone('any').withMessage("Enter a valid mobile number"),
    body('licenseInformation').trim().notEmpty().withMessage("License information is required"),
    body('vehicleInformation').trim().notEmpty().withMessage("Vehicle information is required"),
    body('locationData').isArray({ min: 2 }).withMessage("Location data must contain at least 2 coordinates")
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if driver with the same mobile number already exists
        const existingDriver = await Driver.findOne({ mobileNumber: req.body.mobileNumber });
        if (existingDriver) {
            return res.status(400).json({ error: "Driver with this mobile number already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        // Create a new driver
        const newDriver = await Driver.create({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            licenseInformation: req.body.licenseInformation,
            vehicleInformation: req.body.vehicleInformation,
            shiftAvailability: req.body.shiftAvailability || true, // Default value
            locationData: req.body.locationData,
            password: secPass
        });
        const drivedata = {
            newDriver: {
                id: newDriver.id
            }
        }
        const authtoken = jwt.sign(drivedata, JWT_SECRET)
        // console.log(authtoken)
        res.status(201).json({ authtoken });
        // res.status(201).json(newDriver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/loginenterprise',
    [body('password').exists(),
    body('email').trim().isEmail().withMessage("enter valid email")
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            const enterprise = await Enterprise.findOne({ email });
            if (!enterprise) {
                return res.status(404).json({ error: "Please try to login with current credentials" })
            }
            const passwordCompare = await bcrypt.compare(password, enterprise.password);
            if (!passwordCompare) {
                return res.status(404).json({ error: "Please try to login with current credentials" })
            }
            const driverdata = {
                enterprise: {
                    id: enterprise.id
                }
            }
            const authtoken = jwt.sign(driverdata, JWT_SECRET)

            res.status(201).json({ authtoken })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    })

//Login the driver
router.post('/logindriver', [
    body('password').exists(),
    body('mobileNumber').trim().isMobilePhone('any').withMessage("Enter a valid mobile number")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { mobileNumber, password } = req.body;
        const driver = await Driver.findOne({ mobileNumber });
        if (!driver) {
            return res.status(404).json({ error: "Driver not found. Please try again." });
        }
        const passwordCompare = await bcrypt.compare(password, driver.password);
        if (!passwordCompare) {
            return res.status(401).json({ error: "Invalid password. Please try again." });
        }
        const driverData = {
            driver: {
                id: driver.id
            }
        };
        const authtoken = jwt.sign(driverData, JWT_SECRET);
        res.status(200).json({ authtoken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//route 4 to make a request
router.post('/makeorder', [
    body('projectName', 'Enter the correct project name').exists(),
    body('orderDetails', 'Write apt description').exists().isLength({ min: 5 })], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const newOrder = await Orders.create({
                projectName: req.body.projectName,
                coordinates: req.body.coordinates,
                coordinatesTravelled: req.body.coordinatesTravelled,
                orderAmount: req.body.orderAmount,
                orderDetails: req.body.orderDetails,
                orderStatus: req.body.orderStatus,
                orderDelivered: req.body.orderDelivered,
                orderEnterprise: req.body.orderEnterprise,
                orderDriver: req.body.orderDriver,
            })
            res.send(newOrder)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


)
//ROute 5 For getting request
router.get('/getallorderinfo',async (req,res)=>{
    const orders = await Order.find({});
    res.json(orders);
})
//Route 6 for getting order by id
router.get('/getorder/:id',async(req,res)=>{
    const id = req.params.id;
    const order = await Order.findById(id);

    res.json(order);
})
router.get('/getdriverdata/:id',async(req,res)=>{
    const id = req.params.id;
    const Driverdata = await Driver.findById(id).select('-password');

    res.json(Driverdata);
})
router.put('/changestatus/:id', async(req,res)=>{
    const id=req.params.id;
    const request=await Order.findByIdAndUpdate(id,{orderStatus:"accepted"});
    res.json(request);
})  
router.delete('/deleterequest/:id', async(req,res)=>{
    const id=req.params.id;
    const request=await Order.findByIdAndDelete(id);
    res.json(request);
})

module.exports = router;



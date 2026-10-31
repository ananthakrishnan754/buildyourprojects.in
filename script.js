// Firebase is loaded via compat CDN scripts in HTML

// Firebase Configuration (Replace with actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDgtQs0mreNT7uSFVrhaPcy_YUeqgO_F8Q",
    authDomain: "buildyourprojects-f3983.firebaseapp.com",
    databaseURL: "https://buildyourprojects-f3983-default-rtdb.firebaseio.com",
    projectId: "buildyourprojects-f3983",
    storageBucket: "buildyourprojects-f3983.firebasestorage.app",
    messagingSenderId: "702758316685",
    appId: "1:702758316685:web:4687d58580ab41a2a210c4",
    measurementId: "G-F6RVLC6XEB"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Data - loaded from inline script or hardcoded
let projects = window.__BUILDYOURPROJECTS_DATA__?.projects || [
    { title: "NCD-Predict: ML Health Screening", tags: ["FastAPI", "Machine Learning", "LightGBM", "Healthcare", "Explainable AI", "Python", "PostgreSQL"], description: "A non-invasive diabetes & hypertension risk prediction system for Kerala\u2019s 35+ population. Uses LightGBM with SHAP explainable AI and a mobile-friendly web UI for community health workers.", price: "Contact for pricing.", images: ["images/ncd-predict-form.png", "images/ncd-predict-results.png"], isFeatured: true },
    { title: "MisinfoGuard - AI Misinformation Detector", tags: ["AI", "Deep Learning", "Flutter", "FastAPI", "NLP", "Computer Vision"], description: "A multimodal misinformation detection system that analyzes text, images, source credibility, and social propagation patterns simultaneously using BERT, ResNet-18, and GNN fusion.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
    { title: "WhatsApp Summarizer (Android)", tags: ["Android", "Kotlin", "Jetpack Compose", "Gemini AI", "NLP"], description: "An AI-powered Android app that reads WhatsApp notifications, summarizes messages, and transcribes voice notes (including Malayalam) using Gemini AI. Detects meetings/tasks and adds to Google Calendar.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
    { title: "Person-Following Rover (RPi 5)", tags: ["Raspberry Pi", "AI", "Computer Vision", "Robotics", "PID Control"], description: "A Raspberry Pi 5-powered rover that uses a webcam and OpenCV person detection with PID control loops to follow a target autonomously in real-time.", price: "Starting from \u20b917,500.", images: ["images/placeholder-project.svg"], isFeatured: true },
    { title: "ESP32 BLE Bike Navigation", tags: ["ESP32", "BLE", "GPS", "Navigation", "IoT", "Embedded"], description: "A BLE-enabled bike navigation system using ESP32, ST7735 display, and Leaflet.js map integration with OSRM routing \u2014 no internet required in the field.", price: "Starting from \u20b915,800.", images: ["images/placeholder-project.svg"], isFeatured: false },
    { title: "AI Solar Panel Cleaner Robot", tags: ["YOLOv8", "ESP8266", "AI", "Computer Vision", "Automation"], description: "An AI-driven solar panel cleaning system using YOLOv8 object detection mounted on an XY gantry robot with ESP8266 WiFi control.", price: "Contact for custom pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
    { title: "AI Vision Autonomous Rover", tags: ["Raspberry Pi", "AI", "Computer Vision", "Autonomous", "Robotics"], description: "A high-performance Raspberry Pi-powered robot utilizing OpenCV and deep learning for real-time lane detection and autonomous navigation.", price: "Starting from \u20b916,500.", images: ["images/ai-vision-autonomous-rover.jpg"], isFeatured: true },
    { title: "IoT Battery Manager (ESP32)", tags: ["ESP32", "IoT", "Battery Management", "Dashboard", "Sensors"], description: "A professional-grade battery monitoring system tracking critical parameters like voltage, current, and temperature with a cloud-integrated dashboard.", price: "Starting from \u20b916,500.", images: ["images/iot-battery-manager-esp32.jpg"], isFeatured: true },
    { title: "ML Battery Fault Detector", tags: ["ESP32", "Machine Learning", "ML", "Fault Detection", "AI"], description: "An intelligent diagnostic device leveraging TinyML on ESP32 to predict battery failures and anomalies using pattern recognition.", price: "Contact for a detailed quote.", images: ["images/ml-battery-fault-detector.jpg"], isFeatured: false },
    { title: "Real-Time Data Dashboard", tags: ["Raspberry Pi", "Dashboard", "Data Visualization", "IoT", "Web"], description: "A full-stack monitoring solution featuring a low-latency web dashboard utilizing WebSockets for streaming sensor data.", price: "Starting from \u20b918,000.", images: ["images/real-time-data-dashboard.jpg", "images/real-time-data-dashboard-2.jpg"], isFeatured: true },
    { title: "Age-GAN Image Generator", tags: ["AI", "Deep Learning", "GAN", "Cybersecurity", "Python"], description: "An advanced deep learning project utilizing Generative Adversarial Networks (GANs) to synthesize realistic human face images for specific age groups.", price: "Contact for pricing.", images: ["images/age-gan-image-generator.jpg"], isFeatured: false },
    { title: "TimeTraveller - AI Face Aging", tags: ["AI", "Stable Diffusion", "Computer Vision", "Python", "Flask"], description: "An offline AI web app using Stable Diffusion v1.5 to generate facial images at different ages from a single photo. Privacy-first \u2014 all processing runs locally.", price: "Contact for pricing.", images: ["images/time-traveller.svg"], isFeatured: false },
    { title: "Smart Railway Dustbin (IoT)", tags: ["ESP32", "Flask", "IoT", "Automation", "Web Dashboard"], description: "An automated waste management system using ESP32 and a Flask backend for automatic wet/dry waste segregation.", price: "Starting from \u20b915,800.", images: ["images/smart-railway-dustbin-iot.jpg", "images/smart-railway-dustbin-iot-2.jpg"], isFeatured: true },
    { title: "AI Waste Sorter Robot", tags: ["Raspberry Pi", "AI", "Computer Vision", "Robotics", "Automation"], description: "An industrial-style sorting system combining a Raspberry Pi and a conveyor belt using a CNN to categorize waste materials.", price: "Contact for custom hardware pricing.", images: ["images/ai-waste-sorter-robot.jpg", "images/ai-waste-sorter-robot-2.jpg"], isFeatured: false },
    { title: "Autonomous Person-Following Drone", tags: ["Drone", "AI", "Tracking", "GPS", "Autonomous"], description: "A sophisticated UAV project featuring AI-based human tracking using computer vision and PID control loops.", price: "High-end project. Contact for quote.", images: ["images/autonomous-person-following-drone.jpg"], isFeatured: false },
    { title: "Agri-Tech IoT Rover", tags: ["ESP32", "IoT", "Agriculture", "ML", "Automation"], description: "A smart agricultural vehicle equipped with NPK and soil moisture sensors using ML to analyze soil health.", price: "Starting from \u20b917,500.", images: ["images/agri-tech-iot-rover.jpg"], isFeatured: false },
    { title: "AI Robotic Arm (Pick & Place)", tags: ["Raspberry Pi", "Robotic Arm", "AI", "ML", "Pick and Place"], description: "A 4-DOF precision robotic arm powered by Raspberry Pi, using OpenCV for color and shape detection.", price: "Contact for a custom quote.", images: ["images/ai-robotic-arm-pick-place.jpg"], isFeatured: false },
    { title: "Lidar Autonomous Wheelchair", tags: ["Lidar", "Autonomous", "Safety", "Healthcare", "Robotics"], description: "A medical-grade navigation system utilizing Lidar for SLAM (Simultaneous Localization and Mapping) to ensure safe movement.", price: "High-end project. Contact for quote.", images: ["images/lidar-autonomous-wheelchair.jpg"], isFeatured: false },
    { title: "Lidar Surveillance Bot", tags: ["Lidar", "Surveillance", "Autonomous", "Robotics", "IoT"], description: "An autonomous security robot that uses Lidar for 2D/3D environment mapping and patrolling.", price: "Contact for detailed quote.", images: ["images/lidar-surveillance-bot.jpg"], isFeatured: false },
    { title: "Radar Surveillance Rover", tags: ["Radar", "Surveillance", "Manual Control", "Robotics", "IoT"], description: "A specialized surveillance vehicle featuring 360\u00b0 radar detection for remote spatial awareness.", price: "Starting from \u20b915,200.", images: ["images/radar-surveillance-rover.jpg"], isFeatured: false },
            { title: "AI-Based MPPT for Grid-Connected Solar PV Using Deep Q-Network", tags: ["Solar", "AI", "Reinforcement Learning", "MATLAB", "ESP32"], description: "An AI-driven maximum power point tracking system using Deep Q-Network for grid-connected solar PV systems. The RL agent learns optimal tracking strategies across varying irradiance and temperature conditions, outperforming conventional P&O and INC algorithms.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Bidirectional DC-DC Converter for V2G EV Charging with MPC", tags: ["EV", "Power Electronics", "Model Predictive Control", "dSPACE"], description: "A bidirectional DC-DC converter for Vehicle-to-Grid EV charging using Model Predictive Control for precise power flow regulation. Supports both G2V and V2G modes with grid frequency support capability.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Seven-Level Cascaded H-Bridge Multilevel Inverter for PV Systems", tags: ["Inverter", "Solar", "Power Electronics", "PSIM"], description: "A seven-level cascaded H-Bridge multilevel inverter designed for photovoltaic systems with reduced total harmonic distortion. Features advanced PWM strategies for grid-tied operation.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "IoT-Enabled Smart Energy Meter with Power Quality Monitoring", tags: ["IoT", "Smart Grid", "Arduino", "ESP32", "ThingSpeak"], description: "A smart energy meter with real-time power quality monitoring including THD analysis, power factor measurement, and cloud dashboard for remote monitoring via ThingSpeak.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Federated Learning for Anomaly Detection in Smart Grid AMI", tags: ["AI", "Smart Grid", "Federated Learning", "TensorFlow"], description: "A privacy-preserving federated learning framework for detecting anomalies in Advanced Metering Infrastructure across distributed smart grid nodes without centralizing sensitive data.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "High-Gain Interleaved Boost Converter for Fuel Cell EV", tags: ["DC-DC", "EV", "Fuel Cell", "TI C2000"], description: "A high-gain interleaved boost converter with voltage multiplier stage designed for fuel cell electric vehicle applications. Achieves high voltage gain with reduced component stress.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Sensorless Speed Control of PMSM Using Extended Kalman Filter", tags: ["Motor Drive", "EV", "PMSM", "dSPACE"], description: "A sensorless speed control system for Permanent Magnet Synchronous Motors using Extended Kalman Filter for rotor position estimation in EV propulsion applications.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Blockchain-Based P2P Renewable Energy Trading in Microgrid", tags: ["Microgrid", "Blockchain", "Ethereum", "Python"], description: "A peer-to-peer renewable energy trading platform using blockchain smart contracts for microgrid networks. Enables prosumers to trade surplus solar energy transparently.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Active PFC Using Bridgeless SEPIC Converter for LED Drivers", tags: ["Power Factor", "PFC", "SEPIC", "Arduino"], description: "An active power factor correction system using bridgeless SEPIC converter topology for high-efficiency LED driver applications with near-unity power factor.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "DNN-Based Fault Diagnosis in Induction Motors Using Vibration", tags: ["Motor", "AI", "Deep Learning", "TensorFlow"], description: "A deep neural network-based fault diagnosis system for three-phase induction motors analyzing vibration signals for bearing faults, rotor bar defects, and stator winding issues.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Hybrid Wind-Solar Microgrid EMS Using Fuzzy Logic Controller", tags: ["Renewable Energy", "Microgrid", "Fuzzy Logic", "MATLAB"], description: "A hybrid wind-solar microgrid energy management system using fuzzy logic controller for optimal power sharing between renewable sources and battery storage.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Wireless Power Transfer for Implantable Medical Devices", tags: ["WPT", "Biomedical", "MATLAB", "HFSS"], description: "A wireless power transfer system for implantable medical devices with adaptive impedance matching for efficient power delivery through biological tissue layers.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Grid-Forming Inverter Control for Islanded Microgrid with VSG", tags: ["Microgrid", "Inverter", "VSG", "PSCAD"], description: "A grid-forming inverter control strategy using Virtual Synchronous Generator for stable islanded microgrid operation with seamless grid reconnection capability.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Li-Ion Battery SOC Estimation Using Unscented Kalman Filter", tags: ["Battery", "BMS", "Kalman Filter", "Arduino"], description: "An advanced State of Charge estimation system for lithium-ion batteries using Unscented Kalman Filter with thermal compensation for accurate battery management.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Reconfigurable Solar PV Array for Partial Shading Mitigation", tags: ["Solar", "Optimization", "Genetic Algorithm", "ESP32"], description: "A reconfigurable solar PV array topology using genetic algorithm optimization to mitigate partial shading effects and maximize energy yield under non-uniform irradiance.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Dual Active Bridge Converter for Solid-State Transformer", tags: ["SST", "Smart Grid", "DAB", "TI C2000"], description: "A Dual Active Bridge converter-based solid-state transformer for smart grid applications with galvanic isolation and bidirectional power flow capability.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Predictive Current Control of Grid-Connected Three-Phase Inverter", tags: ["Grid Inverter", "MPC", "Renewable Energy", "dSPACE"], description: "A model predictive current control strategy for grid-connected three-phase inverters ensuring high power quality and fast dynamic response for renewable energy integration.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Energy Harvesting from Roadway Piezoelectric Elements", tags: ["Energy Harvesting", "Piezoelectric", "Boost Converter", "Arduino"], description: "A roadway energy harvesting system using piezoelectric elements with DC-DC boost converter interface for powering traffic signals and IoT road sensors.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "RL-Based Optimal Energy Dispatch for Residential Microgrids", tags: ["AI", "Microgrid", "Reinforcement Learning", "Python"], description: "A reinforcement learning-based optimal energy dispatch system for battery storage in residential microgrids, minimizing electricity cost while maintaining comfort levels.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "SiC MOSFET-Based Three-Phase Vienna Rectifier for EV Charger", tags: ["EV Charger", "SiC", "Power Electronics", "MATLAB"], description: "A high-efficiency three-phase Vienna rectifier using SiC MOSFETs for electric vehicle on-board charger applications with power factor correction.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Cyber-Attack Detection in Smart Grid AMI Using ML", tags: ["Cybersecurity", "AI", "Smart Grid", "Scikit-learn"], description: "A machine learning-based cyber-attack detection system for smart grid Advanced Metering Infrastructure identifying false data injection, replay, and DoS attacks.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Non-Isolated High Step-Up DC-DC Converter for PV Microinverter", tags: ["DC-DC", "Solar", "Coupled Inductor", "PSIM"], description: "A non-isolated high step-up DC-DC converter with coupled inductor for photovoltaic microinverter applications achieving high voltage gain with reduced switching losses.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Buck-Boost Integrated Full Bridge Inverter for Solar PV Standalone", tags: ["Solar", "Inverter", "Power Electronics", "MATLAB"], description: "A buck-boost integrated full bridge inverter for standalone solar photovoltaic systems combining DC-DC conversion and DC-AC inversion in a single stage for improved efficiency.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Maximum Power Extraction from Grid-Connected PV Using Phase Angle Control", tags: ["Solar", "Grid-Tied", "MPPT", "MATLAB"], description: "A novel method to extract maximum power from solar panels in grid-connected PV systems using phase angle and hysteresis current control for optimal power transfer.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Optimum Point Tracker for Solar Cell Power Supply System", tags: ["Solar", "MPPT", "Power Electronics"], description: "An optimum point tracker for solar cell power supply systems implementing advanced MPPT algorithms for maximum energy harvesting under varying environmental conditions.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Android-Based Home and Office Automation System", tags: ["IoT", "Automation", "Arduino", "Android"], description: "An Android-based device control system for home and office automation using Bluetooth/WiFi communication with relay modules for appliance switching.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Smart LED Home Automation with Android Control", tags: ["IoT", "Automation", "Arduino", "Smart Home"], description: "An Android-integrated LED smart home automation system with dimming control, scheduling, and voice command support for energy-efficient lighting management.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Asymmetrical Two-Phase Induction Motor Speed Control by Multilevel Inverter", tags: ["Motor Drive", "Inverter", "Cascaded Transformer", "MATLAB"], description: "Speed control of asymmetrical two-phase induction motor using multilevel inverter employing cascaded transformers for reduced harmonic content and smooth operation.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Auto Digital Speed Indicator with Speed Control", tags: ["Motor Drive", "Embedded", "Arduino"], description: "An automatic digital speed indicator with closed-loop speed control system for DC motors using optical encoder feedback and PID control algorithm.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "DC Motor Speed Control via Bluetooth with Automatic Feedback", tags: ["Motor Drive", "Bluetooth", "Arduino", "PWM"], description: "A Bluetooth-controlled DC motor speed controller with automatic feedback via PWM technology for real-time speed regulation and monitoring.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Battery Management System Using Arduino", tags: ["BMS", "Battery", "Arduino", "IoT"], description: "A complete battery management system built on Arduino platform for monitoring cell voltages, temperature, and implementing charge/discharge protection with IoT dashboard.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Solar Panel Data Acquisition Using 2-Channel Data Logger and .NET", tags: ["Solar", "Data Acquisition", ".NET", "Monitoring"], description: "A solar panel data acquisition and monitoring system using a 2-channel data logger with .NET application for performance analysis and fault detection.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "DC Motor Speed Control Using Bluetooth Module", tags: ["Motor Drive", "Bluetooth", "Embedded", "Arduino"], description: "A simple yet effective DC motor speed control system using HC-05 Bluetooth module with smartphone app interface for wireless speed adjustment.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Advanced Security System with Power Saving (Invisible Eye)", tags: ["Security", "Embedded", "IR Sensor", "Power Saving"], description: "An advanced security system featuring invisible eye technology with automatic power saving mode using PIR and laser-based intrusion detection.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Transformer Health Monitoring System Using GSM Technology", tags: ["Transformer", "GSM", "Monitoring", "BTech"], description: "A real-time transformer health monitoring system using GSM technology for remote monitoring of oil temperature, winding temperature, and load conditions with SMS alerts.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Automated Renewable Power Generation and Smart Street Light Control", tags: ["Renewable Energy", "IoT", "Smart City", "Arduino"], description: "An automated power generation system integrating solar and wind sources with intelligent street light control using LDR and motion sensors for energy optimization.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Electric Field and Ultrasonic Sensor Based Security System", tags: ["Security", "Sensor", "Embedded"], description: "A dual-mode security system combining electric field sensing and ultrasonic detection for comprehensive perimeter protection with alarm and notification system.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Electrical Substation Monitoring and Control from Remote Area", tags: ["SCADA", "IoT", "Embedded", "Smart Grid"], description: "A remote electrical substation monitoring and control system using IoT-enabled sensors and GSM communication for real-time parameter tracking and remote switching.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Advanced Metering Infrastructure Based on Zigbee (Enerbee)", tags: ["Smart Grid", "Zigbee", "AMI", "IoT"], description: "An advanced metering infrastructure implementation using Zigbee wireless communication for smart grid applications with automatic meter reading and demand response.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Energy Monitoring System with Auto Load Management", tags: ["Energy", "IoT", "Arduino", "Monitoring"], description: "An energy scrutinizing system with automatic load management for optimal power distribution and consumption tracking in residential and commercial buildings.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Foot-Step Based Power Generation and Multi-Purpose Optimisation", tags: ["Energy Harvesting", "Piezoelectric", "Power Electronics"], description: "A foot-step power generation system using piezoelectric transducers with multi-purpose optimization for generating electricity from pedestrian foot traffic in public areas.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "GSM and PIR Sensor Based Light Controller with Safety System", tags: ["IoT", "Security", "GSM", "PIR"], description: "A GSM and PIR sensor-based light controller with networked safety system for automatic lighting control and intrusion detection with mobile alerts.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "High-Efficiency DC-DC Converter for Large Input Voltage Fluctuations", tags: ["DC-DC", "Solar", "Power Electronics", "MTech"], description: "A high-efficiency DC-DC converter designed to handle large input voltage fluctuations in solar applications using adaptive duty cycle control.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Web-of-Things Based Smart Grid for Renewable Energy Monitoring", tags: ["Smart Grid", "IoT", "Web", "Renewable Energy"], description: "A Web-of-Things based smart grid system to remotely monitor and control renewable energy sources using web dashboards and RESTful APIs.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Intelligent Multi Timer System for Industrial Automation", tags: ["Industrial", "Embedded", "Microcontroller", "Automation"], description: "A microcontroller-based intelligent multi-timer system for industrial automation supporting multiple simultaneous timing operations with precision control.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Mobile-Controlled DC Motor Speed Controller", tags: ["Motor Drive", "Mobile", "Embedded", "Arduino"], description: "A mobile phone-controlled DC motor speed controller using DTMF or Bluetooth for remote industrial motor speed adjustment and monitoring.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Online Speed Control of DC Motor with High Speed Network", tags: ["Motor Drive", "Real-Time", "Networking", "Embedded"], description: "An online DC motor speed control system using high-speed network communication for real-time industrial motor management and monitoring.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Power Factor Metering System Using Arduino", tags: ["Power Factor", "Arduino", "Metering", "Embedded"], description: "An automated power factor metering system using Arduino with real-time display and automatic capacitor bank switching for power factor correction.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Pre-Paid Power Energy Meter", tags: ["Smart Meter", "Embedded", "IoT", "Prepaid"], description: "A pre-paid power energy meter system with smart card integration for automatic electricity billing, load disconnection on balance expiry, and recharge capability.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Real-Time Load Shedding for Power Lines", tags: ["Power Systems", "Embedded", "Real-Time", "Protection"], description: "A real-time load shedding system for power lines with automatic detection of overload conditions and priority-based load disconnection to prevent grid collapse.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Prepaid Bill Management System for Electricity Board", tags: ["Smart Meter", "IoT", "Billing", "Embedded"], description: "A complete prepaid bill management system for electricity boards with mobile recharge, real-time balance tracking, and automatic disconnection/reconnection.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Real-Time Detection of Electrical Disturbances for Smart Grid", tags: ["Smart Grid", "Power Quality", "Embedded", "Monitoring"], description: "A real-time detection system for electrical disturbances including voltage sags, swells, harmonics, and transients for remote communication stations and smart grid nodes.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Smart Card Based Prepaid Electricity Billing System", tags: ["Smart Meter", "Smart Card", "Embedded", "Billing"], description: "A smart card-based prepaid electricity billing system with encrypted card authentication and automatic load management for utility companies.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Solar Tracking with Automatic Panel Cleaning Mechanism", tags: ["Solar", "Automation", "Arduino", "Tracking"], description: "A solar tracking system with automatic panel cleaning mechanism using motorized wipers and water spray for maximum power generation efficiency.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Talking Energy Meter with Voice Output", tags: ["Energy Meter", "Embedded", "Voice", "Accessibility"], description: "An energy meter with built-in voice output that announces real-time power consumption, bill amount, and alerts in local languages for accessibility.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Transformer Parameter Management with Electricity Board Intimation", tags: ["Transformer", "IoT", "Monitoring", "SCADA"], description: "A transformer industrial parameters management and control system with automatic intimation to electricity boards for overload and fault conditions via GSM/IoT.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Transmission Line Multiple Faults Detection and Indication", tags: ["Power Systems", "Fault Detection", "Embedded", "Protection"], description: "A transmission line fault detection system identifying multiple fault types (LL, LG, LLG, 3-phase) with automatic indication to the electricity board.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Universal Power Generation from Solar, Wind and Rain", tags: ["Renewable Energy", "Hybrid", "Power Electronics", "Multi-Source"], description: "A universal electrical power generation system integrating solar, wind, and rain water energy sources with multi-purpose optimization for maximum energy harvesting.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Arduino-Based AC Electrical Machine Diagnosis", tags: ["Motor Drive", "Arduino", "Diagnostics", "Embedded"], description: "An Arduino-based diagnostic platform for AC electrical machines using vibration analysis, current signature analysis, and thermal monitoring for predictive maintenance.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Voice-Operated Induction Motor Speed Control via RF", tags: ["Motor Drive", "Voice Control", "RF", "Embedded"], description: "A voice-operated induction motor speed control system using RF communication for hands-free industrial motor speed adjustment with safety interlocks.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Wireless Power Transmission System", tags: ["WPT", "Power Electronics", "Resonant Coupling"], description: "A wireless power transmission system using resonant inductive coupling for short-range cordless charging applications with efficiency optimization.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Wireless Residential Power Monitoring System", tags: ["IoT", "Smart Home", "Monitoring", "Embedded"], description: "A wireless residential power monitoring system with real-time consumption tracking, appliance-level monitoring, and mobile app dashboard for energy management.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Reduced THD and CMV in 5-Level Inverter Using FOTID Controller", tags: ["Inverter", "Motor Drive", "Optimization", "MATLAB"], description: "A 5-level inverter-fed induction motor drive with reduced Total Harmonic Distortion and Common Mode Voltage using Fractional Order TID controller with Meerkat optimization.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Cascaded DC-DC Converter for Eco-Friendly Electric Cart", tags: ["DC-DC", "EV", "Power Electronics", "Simulation"], description: "Simulation studies and development of a cascaded DC-DC converter for eco-friendly electric cart systems with regenerative braking energy recovery.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Super Lift Luo Multilevel Inverters for PV Interfacing", tags: ["Inverter", "Solar", "Multilevel", "MATLAB"], description: "Implementation of Super Lift Luo multilevel inverters suitable for photovoltaic interfacing with enhanced voltage boost capability and reduced component count.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Digital Solutions for Grid Efficiency: Shaping the Future of Power", tags: ["Smart Grid", "Digital Twin", "AI", "Power Systems"], description: "A comprehensive digital solutions framework for grid efficiency incorporating digital twins, AI-based forecasting, and IoT monitoring for next-generation power systems.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Bidirectional Off-Board Charger for Grid-Connected EVs with Reactive Power", tags: ["EV Charger", "V2G", "Reactive Power", "Power Electronics"], description: "A bidirectional off-board charger for grid-connected electric vehicles with reactive power compensation capability for grid voltage support.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Predictive System for Early Failure Detection in EV Battery Cells", tags: ["BMS", "EV", "Predictive Maintenance", "ML"], description: "A predictive system for early failure detection in electric vehicle battery cells using electrochemical impedance spectroscopy and machine learning classification.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Comparative Analysis of Electric Motors for Vehicle Propulsion", tags: ["Motor Drive", "EV", "PMSM", "Comparison"], description: "A comprehensive comparative performance analysis of electric motors (PMSM, induction, SRM) for vehicle propulsion explaining why PMSMs lead the EV industry.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Energy Auditing and Management Using IoT and Machine Learning", tags: ["Energy", "IoT", "Machine Learning", "Smart Building"], description: "An energy auditing and management system using IoT sensors and machine learning algorithms for identifying energy waste and optimizing consumption in commercial buildings.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Li-Ion Cell Discharge Unit for Accurate Battery Capacity Measurement", tags: ["Battery", "Testing", "Embedded", "Arduino"], description: "A precision Li-ion cell discharge unit for accurate battery capacity measurement with constant current discharge and real-time capacity calculation.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Active Cell Balancing for Li-Ion Battery Pack", tags: ["BMS", "Battery", "Balancing", "Power Electronics"], description: "An active cell balancing circuit for series-connected Li-ion battery packs using flyback converter topology with bidirectional energy transfer for uniform cell charging.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true },
            { title: "Real-Time Servomotor Control Using Arduino and MATLAB", tags: ["Motor Drive", "Servo", "Arduino", "MATLAB"], description: "A real-time servomotor control system using Arduino for hardware interface and MATLAB/Simulink for control algorithm development and visualization.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Advanced Fraud Detection in Smart Grids Using Deep Neural Networks", tags: ["Smart Grid", "AI", "Cybersecurity", "Deep Learning"], description: "An advanced fraud detection system for smart grids using deep neural networks to identify electricity theft, meter tampering, and billing fraud patterns.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Sustainable Waste Management and Renewable Energy Generation", tags: ["Renewable Energy", "Waste", "Biogas", "Sustainability"], description: "A sustainable waste management system integrated with renewable energy generation from biogas conversion for campus or community-level implementation.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Enhanced EV Battery Charging Using Interleaved SEPIC and MPC", tags: ["EV Charger", "SEPIC", "MPC", "Power Electronics"], description: "Enhancement of electric vehicle battery charging systems through integration of interleaved SEPIC converter with advanced Model Predictive Control for high efficiency.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: false },
            { title: "Charging Station Locator and Battery Monitoring for EVs", tags: ["EV", "IoT", "GPS", "Mobile App"], description: "An electric vehicle charging station locator and battery monitoring system with GPS-based station finder, real-time battery status, and route optimization.", price: "Contact for pricing.", images: ["images/placeholder-project.svg"], isFeatured: true }
];

async function loadDataFromFirestore() {
    try {
        const projSnapshot = await db.collection("projects").get();
        if (!projSnapshot.empty) {
            projects = projSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    } catch (e) {
        console.warn("Firestore data load failed, using hardcoded data.", e);
    }
}

// Utility functions
const pastelColors = ['#FFE5E5', '#E5FFEA', '#E5F0FF', '#FFF3E5', '#F5E5FF', '#E5FFFF', '#FFFFE5'];

function getInitials(title) {
    const words = title.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(2, words.length); i++) {
        if (words[i].length > 0 && words[i][0].match(/[A-Za-z0-9]/)) {
            initials += words[i][0].toUpperCase();
        }
    }
    return initials;
}

// Rendering components
function renderCards(data, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = '';

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'project-card glass-card';
        const color = pastelColors[index % pastelColors.length];
        const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        let imageHtml = '';
        const initials = getInitials(item.title);
        if (item.images && item.images.length > 0) {
            imageHtml = `<div class="project-slider"><img src="${item.images[0]}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;"></div>`;
        } else {
            imageHtml = `<div class="project-image-placeholder" style="background-color: ${color}">${initials}</div>`;
        }

        const phoneNumber = '919447452039';
        const message = `Hi! I'm interested in the ${item.title}. Can you share more details?`;
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        const actionHtml = `
            <p class="project-pricing">${typeof item.price === 'number' ? `₹${item.price}` : item.price}</p>
            <a href="${waUrl}" target="_blank" class="btn-whatsapp">
                <i class="fab fa-whatsapp"></i> I'm Interested
            </a>
        `;

        card.innerHTML = `
            ${imageHtml}
            <div class="project-content">
                <h3 class="project-title">${item.title}</h3>
                <div class="project-tags">${tagsHtml}</div>
                <p class="project-desc">${item.description}</p>
            </div>
            <div class="project-card-footer">
                ${actionHtml}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Page Specific Logic
document.addEventListener('DOMContentLoaded', async () => {
    const pageId = document.body.id;

    // Always try to load data from Firestore first
    await loadDataFromFirestore();

    if (pageId === 'landing-page') {
        const featuredProjects = projects.filter(p => p.isFeatured).slice(0, 4);
        renderCards(featuredProjects, 'featured-projects-grid');

        initRotatingText();
    }
    else if (pageId === 'projects-page') {
        renderCards(projects, 'projects-grid');
        document.getElementById('projects-counter').textContent = `Showing ${projects.length} projects`;

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = projects.filter(p =>
                    p.title.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term) ||
                    p.tags.some(t => t.toLowerCase().includes(term))
                );
                renderCards(filtered, 'projects-grid');
                document.getElementById('projects-counter').textContent = `Showing ${filtered.length} projects`;

                const noResults = document.getElementById('no-results');
                if (filtered.length === 0) {
                    noResults.classList.remove('hidden');
                    document.getElementById('projects-grid').style.display = 'none';
                } else {
                    noResults.classList.add('hidden');
                    document.getElementById('projects-grid').style.display = 'grid';
                }
            });
        }
    }
    // Bubble cursor effect
    initBubbleCursor();
});

// Visual Effects
function initRotatingText() {
    const words = ["Electronics", "IoT", "Software", "AI", "ML"];
    let wordIndex = 0;
    const rotatingTextEl = document.getElementById('rotating-text');
    const wrapper = document.querySelector('.rotating-text-wrapper');

    if (rotatingTextEl && wrapper) {
        wrapper.style.width = `${rotatingTextEl.offsetWidth}px`;
        setInterval(() => {
            rotatingTextEl.style.opacity = 0;
            rotatingTextEl.style.transform = 'translateY(10px)';
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                rotatingTextEl.textContent = words[wordIndex];
                rotatingTextEl.style.transform = 'translateY(-10px)';
                wrapper.style.width = `${rotatingTextEl.offsetWidth}px`;
                requestAnimationFrame(() => {
                    rotatingTextEl.style.opacity = 1;
                    rotatingTextEl.style.transform = 'translateY(0)';
                });
            }, 300);
        }, 2500);
    }
}

function initBubbleCursor() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) {
            const bubble = document.createElement('div');
            bubble.className = 'cursor-bubble';
            bubble.style.left = `${e.clientX}px`;
            bubble.style.top = `${e.clientY}px`;
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 1200);
        }
    });
}
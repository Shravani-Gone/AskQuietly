const supabase = require('../utils/supabase')

const subjects = [
  // ===================== INFORMATION TECHNOLOGY =====================
  // IT FY
  { name: 'Engineering Mathematics I', branch: 'Information Technology', class: 'FY' },
  { name: 'Engineering Physics', branch: 'Information Technology', class: 'FY' },
  { name: 'Engineering Chemistry', branch: 'Information Technology', class: 'FY' },
  { name: 'Basic Electrical Engineering', branch: 'Information Technology', class: 'FY' },
  { name: 'Engineering Mechanics', branch: 'Information Technology', class: 'FY' },
  { name: 'Programming in C', branch: 'Information Technology', class: 'FY' },
  { name: 'Engineering Drawing', branch: 'Information Technology', class: 'FY' },
  { name: 'Professional Communication', branch: 'Information Technology', class: 'FY' },
  // IT SY
  { name: 'Discrete Mathematical Structures', branch: 'Information Technology', class: 'SY' },
  { name: 'Data Structures', branch: 'Information Technology', class: 'SY' },
  { name: 'Computer Graphics', branch: 'Information Technology', class: 'SY' },
  { name: 'Object Oriented Programming Using Java', branch: 'Information Technology', class: 'SY' },
  { name: 'Theory of Computation', branch: 'Information Technology', class: 'SY' },
  { name: 'Microprocessors and Computer Architecture', branch: 'Information Technology', class: 'SY' },
  { name: 'Computer Networks', branch: 'Information Technology', class: 'SY' },
  { name: 'Mathematical Foundations for AI/ML and Data Science', branch: 'Information Technology', class: 'SY' },
  { name: 'Python Programming', branch: 'Information Technology', class: 'SY' },
  { name: 'Professional Ethics', branch: 'Information Technology', class: 'SY' },
  { name: 'Business Economics', branch: 'Information Technology', class: 'SY' },
  { name: 'General Proficiency', branch: 'Information Technology', class: 'SY' },
  { name: 'Entrepreneurship Development', branch: 'Information Technology', class: 'SY' },
  { name: 'Universal Human Values', branch: 'Information Technology', class: 'SY' },
  // IT TY
  { name: 'Operating Systems', branch: 'Information Technology', class: 'TY' },
  { name: 'Database Management Systems', branch: 'Information Technology', class: 'TY' },
  { name: 'Software Engineering', branch: 'Information Technology', class: 'TY' },
  { name: 'Web Technologies', branch: 'Information Technology', class: 'TY' },
  { name: 'Machine Learning', branch: 'Information Technology', class: 'TY' },
  { name: 'Information Security', branch: 'Information Technology', class: 'TY' },
  { name: 'Mobile Application Development', branch: 'Information Technology', class: 'TY' },
  { name: 'Data Science and Big Data Analytics', branch: 'Information Technology', class: 'TY' },
  // IT Final
  { name: 'Cloud Computing', branch: 'Information Technology', class: 'Final' },
  { name: 'Deep Learning', branch: 'Information Technology', class: 'Final' },
  { name: 'Internet of Things', branch: 'Information Technology', class: 'Final' },
  { name: 'Distributed Systems', branch: 'Information Technology', class: 'Final' },
  { name: 'Blockchain Technology', branch: 'Information Technology', class: 'Final' },
  { name: 'Natural Language Processing', branch: 'Information Technology', class: 'Final' },
  { name: 'Project Management', branch: 'Information Technology', class: 'Final' },
  { name: 'Cyber Security', branch: 'Information Technology', class: 'Final' },

  // ===================== COMPUTER SCIENCE =====================
  // CSE FY
  { name: 'Engineering Mathematics I', branch: 'Computer Science', class: 'FY' },
  { name: 'Engineering Physics', branch: 'Computer Science', class: 'FY' },
  { name: 'Engineering Chemistry', branch: 'Computer Science', class: 'FY' },
  { name: 'Basic Electrical Engineering', branch: 'Computer Science', class: 'FY' },
  { name: 'Engineering Mechanics', branch: 'Computer Science', class: 'FY' },
  { name: 'Programming in C', branch: 'Computer Science', class: 'FY' },
  { name: 'Engineering Drawing', branch: 'Computer Science', class: 'FY' },
  { name: 'Professional Communication', branch: 'Computer Science', class: 'FY' },
  // CSE SY
  { name: 'Discrete Mathematical Structures', branch: 'Computer Science', class: 'SY' },
  { name: 'Data Structures', branch: 'Computer Science', class: 'SY' },
  { name: 'Computer Graphics', branch: 'Computer Science', class: 'SY' },
  { name: 'Object Oriented Programming Using Java', branch: 'Computer Science', class: 'SY' },
  { name: 'Theory of Computation', branch: 'Computer Science', class: 'SY' },
  { name: 'Microprocessors and Computer Architecture', branch: 'Computer Science', class: 'SY' },
  { name: 'Computer Networks', branch: 'Computer Science', class: 'SY' },
  { name: 'Mathematical Foundations for AI/ML and Data Science', branch: 'Computer Science', class: 'SY' },
  { name: 'Python Programming', branch: 'Computer Science', class: 'SY' },
  { name: 'Professional Ethics', branch: 'Computer Science', class: 'SY' },
  { name: 'Business Economics', branch: 'Computer Science', class: 'SY' },
  { name: 'General Proficiency', branch: 'Computer Science', class: 'SY' },
  { name: 'Entrepreneurship Development', branch: 'Computer Science', class: 'SY' },
  { name: 'Universal Human Values', branch: 'Computer Science', class: 'SY' },
  // CSE TY
  { name: 'Operating Systems', branch: 'Computer Science', class: 'TY' },
  { name: 'Database Management Systems', branch: 'Computer Science', class: 'TY' },
  { name: 'Software Engineering', branch: 'Computer Science', class: 'TY' },
  { name: 'Compiler Design', branch: 'Computer Science', class: 'TY' },
  { name: 'Artificial Intelligence', branch: 'Computer Science', class: 'TY' },
  { name: 'Computer Networks', branch: 'Computer Science', class: 'TY' },
  { name: 'Machine Learning', branch: 'Computer Science', class: 'TY' },
  { name: 'Web Development', branch: 'Computer Science', class: 'TY' },
  // CSE Final
  { name: 'Cloud Computing', branch: 'Computer Science', class: 'Final' },
  { name: 'Deep Learning', branch: 'Computer Science', class: 'Final' },
  { name: 'Information Security', branch: 'Computer Science', class: 'Final' },
  { name: 'Distributed Systems', branch: 'Computer Science', class: 'Final' },
  { name: 'Natural Language Processing', branch: 'Computer Science', class: 'Final' },
  { name: 'Big Data Analytics', branch: 'Computer Science', class: 'Final' },
  { name: 'Project Management', branch: 'Computer Science', class: 'Final' },
  { name: 'Blockchain Technology', branch: 'Computer Science', class: 'Final' },

  // ===================== MECHANICAL =====================
  // Mechanical FY
  { name: 'Engineering Mathematics I', branch: 'Mechanical', class: 'FY' },
  { name: 'Engineering Physics', branch: 'Mechanical', class: 'FY' },
  { name: 'Engineering Chemistry', branch: 'Mechanical', class: 'FY' },
  { name: 'Basic Electrical Engineering', branch: 'Mechanical', class: 'FY' },
  { name: 'Engineering Mechanics', branch: 'Mechanical', class: 'FY' },
  { name: 'Programming in C', branch: 'Mechanical', class: 'FY' },
  { name: 'Engineering Drawing', branch: 'Mechanical', class: 'FY' },
  { name: 'Workshop Practice', branch: 'Mechanical', class: 'FY' },
  // Mechanical SY
  { name: 'Strength of Materials', branch: 'Mechanical', class: 'SY' },
  { name: 'Thermodynamics', branch: 'Mechanical', class: 'SY' },
  { name: 'Theory of Machines', branch: 'Mechanical', class: 'SY' },
  { name: 'Manufacturing Processes', branch: 'Mechanical', class: 'SY' },
  { name: 'Fluid Mechanics', branch: 'Mechanical', class: 'SY' },
  { name: 'Engineering Mathematics III', branch: 'Mechanical', class: 'SY' },
  { name: 'Material Science', branch: 'Mechanical', class: 'SY' },
  { name: 'General Proficiency', branch: 'Mechanical', class: 'SY' },
  // Mechanical TY
  { name: 'Machine Design', branch: 'Mechanical', class: 'TY' },
  { name: 'Heat Transfer', branch: 'Mechanical', class: 'TY' },
  { name: 'CAD/CAM', branch: 'Mechanical', class: 'TY' },
  { name: 'Industrial Engineering', branch: 'Mechanical', class: 'TY' },
  { name: 'Dynamics of Machinery', branch: 'Mechanical', class: 'TY' },
  { name: 'Metrology and Quality Control', branch: 'Mechanical', class: 'TY' },
  { name: 'Refrigeration and Air Conditioning', branch: 'Mechanical', class: 'TY' },
  { name: 'Operations Research', branch: 'Mechanical', class: 'TY' },
  // Mechanical Final
  { name: 'Automobile Engineering', branch: 'Mechanical', class: 'Final' },
  { name: 'Advanced Manufacturing', branch: 'Mechanical', class: 'Final' },
  { name: 'Robotics and Automation', branch: 'Mechanical', class: 'Final' },
  { name: 'Power Plant Engineering', branch: 'Mechanical', class: 'Final' },
  { name: 'Finite Element Analysis', branch: 'Mechanical', class: 'Final' },
  { name: 'Supply Chain Management', branch: 'Mechanical', class: 'Final' },
  { name: 'Project Management', branch: 'Mechanical', class: 'Final' },
  { name: 'Entrepreneurship Development', branch: 'Mechanical', class: 'Final' },

  // ===================== CIVIL =====================
  // Civil FY
  { name: 'Engineering Mathematics I', branch: 'Civil', class: 'FY' },
  { name: 'Engineering Physics', branch: 'Civil', class: 'FY' },
  { name: 'Engineering Chemistry', branch: 'Civil', class: 'FY' },
  { name: 'Basic Electrical Engineering', branch: 'Civil', class: 'FY' },
  { name: 'Engineering Mechanics', branch: 'Civil', class: 'FY' },
  { name: 'Programming in C', branch: 'Civil', class: 'FY' },
  { name: 'Engineering Drawing', branch: 'Civil', class: 'FY' },
  { name: 'Workshop Practice', branch: 'Civil', class: 'FY' },
  // Civil SY
  { name: 'Strength of Materials', branch: 'Civil', class: 'SY' },
  { name: 'Fluid Mechanics', branch: 'Civil', class: 'SY' },
  { name: 'Structural Analysis', branch: 'Civil', class: 'SY' },
  { name: 'Surveying', branch: 'Civil', class: 'SY' },
  { name: 'Building Materials and Construction', branch: 'Civil', class: 'SY' },
  { name: 'Engineering Geology', branch: 'Civil', class: 'SY' },
  { name: 'Engineering Mathematics III', branch: 'Civil', class: 'SY' },
  { name: 'General Proficiency', branch: 'Civil', class: 'SY' },
  // Civil TY
  { name: 'Design of Steel Structures', branch: 'Civil', class: 'TY' },
  { name: 'Design of Concrete Structures', branch: 'Civil', class: 'TY' },
  { name: 'Geotechnical Engineering', branch: 'Civil', class: 'TY' },
  { name: 'Transportation Engineering', branch: 'Civil', class: 'TY' },
  { name: 'Environmental Engineering', branch: 'Civil', class: 'TY' },
  { name: 'Hydraulics and Irrigation', branch: 'Civil', class: 'TY' },
  { name: 'Quantity Surveying', branch: 'Civil', class: 'TY' },
  { name: 'Estimating and Costing', branch: 'Civil', class: 'TY' },
  // Civil Final
  { name: 'Advanced Structural Analysis', branch: 'Civil', class: 'Final' },
  { name: 'Foundation Engineering', branch: 'Civil', class: 'Final' },
  { name: 'Construction Management', branch: 'Civil', class: 'Final' },
  { name: 'Remote Sensing and GIS', branch: 'Civil', class: 'Final' },
  { name: 'Prestressed Concrete', branch: 'Civil', class: 'Final' },
  { name: 'Pavement Design', branch: 'Civil', class: 'Final' },
  { name: 'Project Management', branch: 'Civil', class: 'Final' },
  { name: 'Entrepreneurship Development', branch: 'Civil', class: 'Final' },

  // ===================== ENTC =====================
  // ENTC FY
  { name: 'Engineering Mathematics I', branch: 'ENTC', class: 'FY' },
  { name: 'Engineering Physics', branch: 'ENTC', class: 'FY' },
  { name: 'Engineering Chemistry', branch: 'ENTC', class: 'FY' },
  { name: 'Basic Electrical Engineering', branch: 'ENTC', class: 'FY' },
  { name: 'Engineering Mechanics', branch: 'ENTC', class: 'FY' },
  { name: 'Programming in C', branch: 'ENTC', class: 'FY' },
  { name: 'Engineering Drawing', branch: 'ENTC', class: 'FY' },
  { name: 'Professional Communication', branch: 'ENTC', class: 'FY' },
  // ENTC SY
  { name: 'Electronic Circuits', branch: 'ENTC', class: 'SY' },
  { name: 'Digital Electronics', branch: 'ENTC', class: 'SY' },
  { name: 'Signals and Systems', branch: 'ENTC', class: 'SY' },
  { name: 'Electromagnetic Fields', branch: 'ENTC', class: 'SY' },
  { name: 'Analog Communication', branch: 'ENTC', class: 'SY' },
  { name: 'Engineering Mathematics III', branch: 'ENTC', class: 'SY' },
  { name: 'Professional Ethics', branch: 'ENTC', class: 'SY' },
  { name: 'General Proficiency', branch: 'ENTC', class: 'SY' },
  // ENTC TY
  { name: 'Digital Communication', branch: 'ENTC', class: 'TY' },
  { name: 'Microcontrollers and Embedded Systems', branch: 'ENTC', class: 'TY' },
  { name: 'VLSI Design', branch: 'ENTC', class: 'TY' },
  { name: 'Control Systems', branch: 'ENTC', class: 'TY' },
  { name: 'Antenna and Wave Propagation', branch: 'ENTC', class: 'TY' },
  { name: 'Digital Signal Processing', branch: 'ENTC', class: 'TY' },
  { name: 'Computer Networks', branch: 'ENTC', class: 'TY' },
  { name: 'Power Electronics', branch: 'ENTC', class: 'TY' },
  // ENTC Final
  { name: 'Wireless Communication', branch: 'ENTC', class: 'Final' },
  { name: 'Optical Fiber Communication', branch: 'ENTC', class: 'Final' },
  { name: 'Image Processing', branch: 'ENTC', class: 'Final' },
  { name: 'IoT and Embedded Systems', branch: 'ENTC', class: 'Final' },
  { name: 'Satellite Communication', branch: 'ENTC', class: 'Final' },
  { name: 'Radar Engineering', branch: 'ENTC', class: 'Final' },
  { name: 'Project Management', branch: 'ENTC', class: 'Final' },
  { name: 'Entrepreneurship Development', branch: 'ENTC', class: 'Final' },
]

const unitsBySubject = {
  // IT/CSE SY - Real WIT units
  'Discrete Mathematical Structures': ['Mathematical Logic', 'Representation of Expressions', 'Set Theory', 'Relations', 'Functions', 'Algebraic Systems', 'Lattices and Boolean Algebra'],
  'Data Structures': ['Introduction to Data Structures and Stack', 'Queues', 'Lists and Linked Lists', 'Trees', 'Graphs'],
  'Computer Graphics': ['Introduction to Computer Graphics', 'Graphics Programming Using C', 'Graphics Primitives for Drawing and Filling', 'Geometric Transformations', 'Segments Windowing and Clipping', 'Graphic Design Fundamentals'],
  'Object Oriented Programming Using Java': ['Basics of Java and Strings', 'Classes Objects and Methods', 'Inheritance and Interfaces', 'Exceptions and Error Handling', 'IO Programming', 'Java Collections Framework'],
  'Theory of Computation': ['Regular Expressions', 'Finite Automata', 'Kleens Theorem', 'Grammars and Languages', 'Pushdown Automata', 'CFL and Non CFLs', 'Turing Machines'],
  'Microprocessors and Computer Architecture': ['Microprocessor Architecture 8086', 'Instructions', 'Interrupts and DMA', 'Memory Hierarchy Design', 'Instruction Level Parallelism'],
  'Computer Networks': ['Introduction to Computer Networks', 'Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer'],
  'Mathematical Foundations for AI/ML and Data Science': ['Linear Algebra', 'Multivariate Calculus', 'Statistics', 'Probability'],
  'Python Programming': ['Python Programming Constructs', 'Object Oriented Programming in Python', 'Python Standard Library Modules', 'Exception Handling'],
  'Professional Ethics': ['Introduction to Professional Ethics', 'Engineering Ethics', 'Theories in Engineering Ethics', 'Engineering as Social Experimentation', 'Safety and Risk', 'Responsibilities of an Engineer', 'Rights of an Engineer', 'Global Issues'],
  'Business Economics': ['Fundamentals of Economics', 'Demand and Supply', 'Theory of Consumer Behaviour', 'Theory of Production and Costs', 'Analysis of Markets', 'Indian Economy Overview'],
  'General Proficiency': ['Professional Communication', 'Group Discussion Skills', 'Personal Interview Techniques', 'Notices Agendas and Minutes', 'Personality Development'],
  'Entrepreneurship Development': ['Entrepreneur', 'Entrepreneurship Development Programmes', 'Entrepreneurial Project Development', 'Small Medium Enterprises and Support Systems'],
  'Universal Human Values': ['Course Introduction and Value Education', 'Harmony in the Human Being', 'Harmony in Family and Society', 'Harmony in Nature and Existence'],

  // IT TY
  'Operating Systems': ['Introduction to OS', 'Process Management', 'Memory Management', 'File Systems', 'IO Systems and Deadlocks'],
  'Database Management Systems': ['Introduction to DBMS', 'Relational Model and SQL', 'Normalization', 'Transaction Management', 'Indexing and Query Optimization'],
  'Software Engineering': ['Introduction to SE', 'Requirements Engineering', 'Software Design', 'Software Testing', 'Software Project Management'],
  'Web Technologies': ['HTML CSS and JavaScript', 'React and Frontend Frameworks', 'Node.js and Backend', 'REST APIs', 'Deployment and DevOps'],
  'Machine Learning': ['Introduction to ML', 'Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Model Evaluation and Tuning'],
  'Information Security': ['Introduction to Security', 'Cryptography', 'Network Security', 'Application Security', 'Security Policies and Standards'],
  'Mobile Application Development': ['Introduction to Mobile Dev', 'Android Fundamentals', 'UI Design', 'Data Storage and APIs', 'Publishing and Deployment'],
  'Data Science and Big Data Analytics': ['Introduction to Data Science', 'Data Preprocessing', 'Exploratory Data Analysis', 'Big Data Frameworks', 'Data Visualization'],

  // IT Final
  'Cloud Computing': ['Introduction to Cloud', 'Virtualization', 'Cloud Services AWS Azure', 'Cloud Security', 'Cloud Deployment'],
  'Deep Learning': ['Neural Network Basics', 'Convolutional Neural Networks', 'Recurrent Neural Networks', 'Generative Models', 'Applications of DL'],
  'Internet of Things': ['Introduction to IoT', 'IoT Architecture', 'Sensors and Actuators', 'IoT Protocols', 'IoT Applications'],
  'Distributed Systems': ['Introduction to DS', 'Communication', 'Synchronization', 'Consistency and Replication', 'Fault Tolerance'],
  'Blockchain Technology': ['Introduction to Blockchain', 'Cryptographic Foundations', 'Smart Contracts', 'Ethereum and DApps', 'Blockchain Applications'],
  'Natural Language Processing': ['Introduction to NLP', 'Text Preprocessing', 'Language Models', 'Sentiment Analysis', 'NLP Applications'],
  'Project Management': ['Introduction to PM', 'Project Planning', 'Risk Management', 'Agile and Scrum', 'Project Closure'],
  'Cyber Security': ['Introduction to Cyber Security', 'Threats and Attacks', 'Ethical Hacking', 'Digital Forensics', 'Security Compliance'],

  // CSE TY
  'Compiler Design': ['Introduction to Compilers', 'Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Code Generation'],
  'Artificial Intelligence': ['Introduction to AI', 'Search Algorithms', 'Knowledge Representation', 'Machine Learning Basics', 'AI Applications'],
  'Web Development': ['HTML CSS Basics', 'JavaScript', 'Frontend Frameworks', 'Backend Development', 'Database Integration'],

  // CSE Final
  'Big Data Analytics': ['Introduction to Big Data', 'Hadoop Ecosystem', 'Spark', 'Data Warehousing', 'Big Data Applications'],

  // Mechanical
  'Strength of Materials': ['Simple Stresses and Strains', 'Shear Force and Bending Moment', 'Flexural Stresses', 'Torsion', 'Columns and Struts'],
  'Thermodynamics': ['Basic Concepts', 'First Law', 'Second Law', 'Properties of Steam', 'Gas Power Cycles'],
  'Theory of Machines': ['Kinematics of Motion', 'Velocity and Acceleration', 'Gear Trains', 'Cams and Followers', 'Governors and Gyroscopes'],
  'Manufacturing Processes': ['Casting', 'Welding', 'Metal Forming', 'Metal Cutting', 'CNC Machining'],
  'Fluid Mechanics': ['Fluid Properties', 'Fluid Statics', 'Fluid Kinematics', 'Bernoullis Equation', 'Flow Through Pipes'],
  'Engineering Mathematics III': ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'],
  'Material Science': ['Crystal Structure', 'Mechanical Properties', 'Phase Diagrams', 'Heat Treatment', 'Engineering Materials'],
  'Machine Design': ['Design Process', 'Design of Joints', 'Design of Shafts', 'Design of Bearings', 'Design of Gears'],
  'Heat Transfer': ['Conduction', 'Convection', 'Radiation', 'Heat Exchangers', 'Mass Transfer'],
  'CAD/CAM': ['Introduction to CAD', '2D Drafting', '3D Modeling', 'CNC Programming', 'CAM Applications'],
  'Industrial Engineering': ['Work Study', 'Plant Layout', 'Production Planning', 'Quality Control', 'Supply Chain'],
  'Dynamics of Machinery': ['Dynamic Analysis', 'Balancing', 'Vibrations', 'Critical Speed', 'Noise Control'],
  'Metrology and Quality Control': ['Measurement Basics', 'Linear Measurement', 'Angular Measurement', 'Quality Control', 'SQC'],
  'Refrigeration and Air Conditioning': ['Refrigeration Cycles', 'Refrigerants', 'Compressors', 'Air Conditioning Systems', 'Applications'],
  'Operations Research': ['Introduction to OR', 'Linear Programming', 'Transportation Problems', 'Assignment Problems', 'Network Analysis'],
  'Automobile Engineering': ['Engine Systems', 'Transmission Systems', 'Braking Systems', 'Steering Systems', 'Electric Vehicles'],
  'Advanced Manufacturing': ['Additive Manufacturing', 'Micro Manufacturing', 'Nano Technology', 'Smart Manufacturing', 'Industry 4.0'],
  'Robotics and Automation': ['Robot Kinematics', 'Actuators and Sensors', 'Robot Programming', 'Industrial Robots', 'Automation Systems'],
  'Power Plant Engineering': ['Steam Power Plants', 'Gas Turbines', 'Hydro Power', 'Nuclear Power', 'Renewable Energy'],
  'Finite Element Analysis': ['Introduction to FEA', 'Finite Element Formulation', 'Structural Analysis', 'Thermal Analysis', 'FEA Software'],
  'Supply Chain Management': ['Supply Chain Basics', 'Inventory Management', 'Procurement', 'Logistics', 'Supply Chain Optimization'],

  // Civil
  'Structural Analysis': ['Determinacy and Indeterminacy', 'Beams and Frames', 'Arches', 'Cables', 'Matrix Methods'],
  'Surveying': ['Chain Surveying', 'Compass Surveying', 'Plane Table Surveying', 'Levelling', 'Total Station'],
  'Building Materials and Construction': ['Stones and Bricks', 'Cement and Concrete', 'Timber and Glass', 'Building Construction', 'Finishing Works'],
  'Engineering Geology': ['Mineralogy', 'Rock Classification', 'Geological Structures', 'Groundwater', 'Site Investigation'],
  'Design of Steel Structures': ['Steel Sections', 'Tension Members', 'Compression Members', 'Beams', 'Connections'],
  'Design of Concrete Structures': ['Working Stress Method', 'Limit State Method', 'Beams', 'Slabs', 'Columns and Footings'],
  'Geotechnical Engineering': ['Soil Properties', 'Soil Classification', 'Compaction', 'Shear Strength', 'Foundation Design'],
  'Transportation Engineering': ['Highway Engineering', 'Pavement Design', 'Traffic Engineering', 'Railway Engineering', 'Airport Engineering'],
  'Environmental Engineering': ['Water Supply', 'Sewage Treatment', 'Solid Waste', 'Air Pollution', 'Environmental Impact'],
  'Hydraulics and Irrigation': ['Open Channel Flow', 'Hydraulic Structures', 'Groundwater Hydraulics', 'Irrigation Systems', 'Water Management'],
  'Quantity Surveying': ['Estimation Basics', 'Measurement', 'Rate Analysis', 'Tendering', 'Contract Management'],
  'Estimating and Costing': ['Building Estimation', 'Road Estimation', 'Bridge Estimation', 'Cost Analysis', 'Project Costing'],
  'Advanced Structural Analysis': ['Matrix Analysis', 'Plastic Analysis', 'Stability Analysis', 'Dynamic Analysis', 'FEM Applications'],
  'Foundation Engineering': ['Shallow Foundations', 'Deep Foundations', 'Pile Design', 'Ground Improvement', 'Retaining Walls'],
  'Construction Management': ['Project Planning', 'Scheduling', 'Resource Management', 'Quality Management', 'Safety Management'],
  'Remote Sensing and GIS': ['Remote Sensing Basics', 'Satellite Imagery', 'GIS Fundamentals', 'Spatial Analysis', 'Applications'],
  'Prestressed Concrete': ['Concepts of Prestress', 'Materials', 'Pre-tensioning', 'Post-tensioning', 'Losses and Design'],
  'Pavement Design': ['Pavement Materials', 'Flexible Pavement', 'Rigid Pavement', 'Pavement Evaluation', 'Overlay Design'],

  // ENTC
  'Electronic Circuits': ['Diode Circuits', 'BJT Amplifiers', 'FET Amplifiers', 'Feedback Amplifiers', 'Oscillators'],
  'Digital Electronics': ['Number Systems', 'Logic Gates', 'Combinational Circuits', 'Sequential Circuits', 'Memory Devices'],
  'Signals and Systems': ['Signal Classification', 'Fourier Series', 'Fourier Transform', 'Laplace Transform', 'Z Transform'],
  'Electromagnetic Fields': ['Vector Analysis', 'Electrostatics', 'Magnetostatics', 'Maxwell Equations', 'Wave Propagation'],
  'Analog Communication': ['AM Modulation', 'FM Modulation', 'Noise Analysis', 'Receivers', 'Pulse Modulation'],
  'Digital Communication': ['Digital Modulation', 'PCM and DPCM', 'Error Control Coding', 'Spread Spectrum', 'OFDM'],
  'Microcontrollers and Embedded Systems': ['Microcontroller Architecture', 'Assembly Programming', 'Interfacing', 'Embedded C', 'RTOS'],
  'VLSI Design': ['MOS Transistors', 'CMOS Logic', 'Combinational Circuit Design', 'Sequential Circuit Design', 'Testing'],
  'Control Systems': ['Introduction to Control', 'Time Domain Analysis', 'Frequency Domain Analysis', 'Stability Analysis', 'Compensator Design'],
  'Antenna and Wave Propagation': ['Antenna Fundamentals', 'Dipole Antennas', 'Antenna Arrays', 'Wave Propagation', 'Microwave Antennas'],
  'Digital Signal Processing': ['DFT and FFT', 'FIR Filter Design', 'IIR Filter Design', 'Multirate DSP', 'DSP Applications'],
  'Power Electronics': ['Power Diodes', 'Thyristors', 'DC-DC Converters', 'Inverters', 'AC Drives'],
  'Wireless Communication': ['Wireless Channel', 'Cellular Systems', '3G 4G 5G', 'MIMO Systems', 'Wireless LANs'],
  'Optical Fiber Communication': ['Optical Fiber Basics', 'Light Sources', 'Detectors', 'Fiber Optic Systems', 'WDM'],
  'Image Processing': ['Image Fundamentals', 'Image Enhancement', 'Image Segmentation', 'Feature Extraction', 'Image Compression'],
  'IoT and Embedded Systems': ['IoT Architecture', 'Embedded Platforms', 'Sensors and Actuators', 'IoT Protocols', 'IoT Applications'],
  'Satellite Communication': ['Orbital Mechanics', 'Satellite Systems', 'Link Budget', 'Modulation Techniques', 'Applications'],
  'Radar Engineering': ['Radar Basics', 'Radar Equation', 'Pulse Radar', 'Doppler Radar', 'Radar Applications'],

  // FY common
  'Engineering Mathematics I': ['Matrices and Determinants', 'Differential Calculus', 'Integral Calculus', 'Differential Equations', 'Vector Calculus'],
  'Engineering Physics': ['Quantum Mechanics', 'Wave Optics', 'Electromagnetic Theory', 'Semiconductor Physics', 'Superconductivity'],
  'Engineering Chemistry': ['Electrochemistry', 'Corrosion', 'Polymers', 'Water Treatment', 'Fuels and Combustion'],
  'Basic Electrical Engineering': ['DC Circuits', 'AC Circuits', 'Transformers', 'DC Machines', 'AC Machines'],
  'Engineering Mechanics': ['Statics', 'Concurrent Forces', 'Friction', 'Kinematics', 'Dynamics'],
  'Programming in C': ['Introduction to C', 'Control Structures', 'Functions and Arrays', 'Pointers', 'File Handling'],
  'Engineering Drawing': ['Geometrical Constructions', 'Orthographic Projections', 'Isometric Views', 'Sectional Views', 'Development of Surfaces'],
  'Professional Communication': ['Communication Basics', 'Technical Writing', 'Presentation Skills', 'Group Discussion', 'Interview Skills'],
  'Workshop Practice': ['Fitting', 'Welding', 'Carpentry', 'Sheet Metal', 'Casting'],
}

async function seed() {
  console.log('🗑️  Clearing old units and subjects...')
  await supabase.from('units').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('subjects').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📚 Inserting subjects and units...')
  let totalSubjects = 0
  let totalUnits = 0

  for (const subject of subjects) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single()

    if (error) {
      console.error('❌ Subject error:', subject.name, error.message)
      continue
    }

    totalSubjects++
    const units = unitsBySubject[subject.name] || ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5']

    for (let i = 0; i < units.length; i++) {
      const { error: ue } = await supabase.from('units').insert({
        subject_id: data.id,
        name: units[i],
        order_index: i + 1
      })
      if (ue) {
        console.error('❌ Unit error:', units[i], ue.message)
      } else {
        totalUnits++
      }
    }
    console.log(`✅ ${subject.name} (${subject.branch} - ${subject.class})`)
  }

  console.log(`\n🎉 Done! ${totalSubjects} subjects and ${totalUnits} units inserted.`)
  console.log('Now register a student to test!')
}

seed()

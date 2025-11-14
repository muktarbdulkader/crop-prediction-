export const translations = {
  en: {
    // General
    appName: "Agri-AI Assistant",
    appSubtitle:
      "Your all-in-one AI tool for crop prediction, agricultural queries, and plant health analysis.",
    footer:
      "agricultor. — Empowering farmers with AI insights for better harvests.",
    language: "Language",
    welcomeMessage: "Welcome",
    logout: "Logout",
    playAudio: "Play audio",
    useCurrentLocation: "Use My Location",
    fetchingLocation: "Fetching...",

    // Landing Page
    landing: {
      title: "Welcome to the Future of Farming",
      subtitle:
        "Leverage the power of AI to make smarter decisions for your crops. Get instant analysis, predictions, and expert advice.",
      getStarted: "Get Started",
      feature1Title: "Smart Crop Predictor",
      feature1Desc:
        "Input environmental data like rainfall and soil nutrients to get AI-powered recommendations for the most suitable crops.",
      feature2Title: "AgriBot Assistant",
      feature2Desc:
        "Have a question about farming? Chat with our AI assistant to get quick and reliable answers on a wide range of agricultural topics.",
      feature3Title: "Leaf Health Scanner",
      feature3Desc:
        "Upload a photo of a plant leaf to instantly diagnose potential diseases, pests, or nutrient deficiencies with visual analysis.",
    },

    // Auth
    login: "Login",
    register: "Register",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    nameLabel: "Full Name",
    loginPrompt: "Already have an account?",
    registerPrompt: "Don't have an account?",
    backToHome: "Back to Home",
    defaultUsername: "User",

    // Tabs
    predictorTab: "Crop Predictor",
    agriBotTab: "AgriBot",
    scannerTab: "Leaf Scanner",
    soilScannerTab: "Soil Scanner",
    profileTab: "Profile",

    // Visualizations
    visualizations: {
      title: "Data Visualizations",
      heatmap: "Correlation Heatmap",
      importance: "Feature Importance",
      rainfallVsYield: "Rainfall vs Yield",
      tempVsYield: "Temp vs Yield",
      correlation: "Correlation",
      importanceLabel: "Importance",
      yield: "Yield",
      yieldData: "Yield Data",
    },

    // Crop Predictor
    inputParams: "Input Parameters",
    rainfall: "Rainfall (mm)",
    temperature: "Temperature (°C)",
    humidity: "Humidity (%)",
    nitrogen: "Nitrogen (N) (kg/ha)",
    phosphorus: "Phosphorus (P) (kg/ha)",
    potassium: "Potassium (K) (kg/ha)",
    ph: "Soil pH",
    soilType: "Soil Type",
    region: "Region",
    predictButton: "Predict Best Crop",
    analyzingButton: "Analyzing...",
    awaitingPrediction: "Awaiting Prediction",
    awaitingPredictionDesc:
      'Enter your parameters and click "Predict Best Crop" to see results.',
    recommendedCrop: "Recommended Crop",
    confidence: "Confidence",
    expectedYield: "Expected Yield",
    justification: "Justification",
    generateGuideButton: "Generate Farming Guide",
    farmingGuideTitle: "Farming Guide",
    generatingGuide: "Generating Guide...",
    history: {
      title: "Prediction History",
      show: "View History",
      hide: "Hide History",
      clear: "Clear History",
      noHistory:
        "No predictions have been made yet. Your past results will appear here.",
      predictedOn: "Predicted on",
    },
    soilTypes: ["Clay", "Sandy", "Loam", "Silt", "Peat"],
    regions: ["Oromia", "Amhara", "SNNPR", "Tigray", "Somali", "Afar"],

    // AgriBot
    agriBotTitle: "AgriBot Assistant",
    agriBotWelcome:
      "Hello! I am AgriBot. How can I help you with your agricultural questions today?",
    agriBotPlaceholder: "Ask AgriBot a question...",
    send: "Send",
    speakNow: "Speak now...",
    startRecording: "Start voice input",
    stopRecording: "Stop voice input",

    // Leaf Scanner
    scannerTitle: "Leaf Health Scanner",
    uploadPrompt: "Click to upload",
    uploadPromptDrag: "or drag and drop",
    uploadFileType: "PNG, JPG or JPEG (MAX. 5MB)",
    analysisPrompt: "Analysis Prompt",
    plantNameLabel: "Plant/Crop Name (e.g., Corn, Tomato)",
    plantNamePlaceholder: "Enter the name of the plant",
    visualReferenceProTooltip:
      "Pro Feature: Generates a realistic image of the diagnosed issue for better visual confirmation.",
    scanHistory: {
      title: "Scan History",
      show: "View History",
      hide: "Hide History",
      clear: "Clear History",
      noHistory:
        "No scans have been saved yet. Your past analyses will appear here.",
      viewScan: "View Scan",
    },
    scanner: {
      analysisPromptPrefix: "Analyze this leaf from a",
      defaultPrompt:
        "Analyze this leaf image for any signs of disease, pests, or nutrient deficiencies. Provide a possible diagnosis and suggest remedies if applicable.",
      useExamples: "Or try one of our examples",
      useThisExample: "Use this Example",
      examples: [
        {
          name: "Healthy Corn Leaf",
          image: "https://placehold.co/600x400/a3e635/ffffff?text=Healthy+Corn",
          prompt: "Is this corn leaf healthy?",
          analysis: {
            analysis:
              "### Analysis: Healthy\n\nThis appears to be a healthy corn leaf. There are no significant signs of common diseases like Northern Corn Leaf Blight, Gray Leaf Spot, or rust. The color is a uniform green, and there are no visible lesions, spots, or discoloration.",
            confidence: 98.5,
          },
        },
        {
          name: "Northern Corn Leaf Blight",
          image:
            "https://placehold.co/600x400/f59e0b/ffffff?text=Diseased+Corn",
          prompt: "What disease is affecting this corn leaf?",
          analysis: {
            analysis:
              "### Diagnosis: Northern Corn Leaf Blight (NCLB)\n\n**Symptoms:** The long, elliptical, grayish-green or tan lesions are characteristic of Northern Corn Leaf Blight, a common fungal disease in corn.\n\n**Recommendation:** Monitor the spread. For severe cases, consider applying a fungicide. Crop rotation and using resistant hybrids are effective long-term prevention strategies.",
            confidence: 92.0,
          },
        },
        {
          name: "Potassium Deficiency",
          image:
            "https://placehold.co/600x400/facc15/ffffff?text=Deficient+Corn",
          prompt: "What nutrient deficiency is visible on this leaf?",
          analysis: {
            analysis:
              "### Diagnosis: Potassium (K) Deficiency\n\n**Symptoms:** The yellowing along the margins of the lower, older leaves is a classic symptom of Potassium deficiency in corn. Potassium is mobile in the plant, so the plant moves it from older to newer growth, causing the deficiency to appear on lower leaves first.\n\n**Recommendation:** Soil testing is recommended to confirm the deficiency. If confirmed, apply a potassium-rich fertilizer.",
            confidence: 95.8,
          },
        },
      ],
    },
    analysisButton: "Analyze Leaf",
    scanAnotherLeaf: "Scan Another Leaf",
    aiInspecting: "AI is inspecting the leaf...",
    analysisResult: "Analysis Result",
    confidenceScore: "Confidence Score",
    feedbackPrompt: "Was this analysis helpful?",
    feedbackThanks: "Thank you for your feedback!",
    useCamera: "Use Camera",
    capture: "Capture",
    closeCamera: "Close Camera",
    getTreatmentButton: "Get Pro Treatment Plan",
    generatingTreatment: "Generating Treatment Plan...",
    treatmentPlanTitle: "Pro Treatment Plan",
    visualReferenceTitle: "AI-Generated Visual Reference",
    generatingVisual: "Generating visual aid...",
    visualReferenceDisclaimer:
      "Note: This is an AI-generated image for illustrative purposes.",
    upgradeModal: {
      title: "Pro Feature Locked",
      body: "Get specific treatment recommendations, including commercial and organic options, by upgrading to Agri-AI Pro.",
      actionButton: "Go to Profile to Upgrade",
      closeButton: "Maybe Later",
    },

    // Soil Scanner
    soilScannerTitle: "Soil Scanner",
    soilAnalysisPrompt: "Optional Prompt (e.g., what can I grow here?)",
    soilScannerDefaultPrompt: "Provide a full analysis of this soil.",
    soilAnalysisButton: "Analyze Soil",
    scanAnotherSoil: "Scan Another Sample",
    aiAnalyzingSoil: "AI is analyzing the soil...",
    soilAnalysisResult: "Soil Analysis Result",

    // Profile Page
    profile: {
      title: "User Profile",
      overview:
        "This is your personal space. View and manage your profile details here to keep your account up-to-date.",
      manageTitle: "Manage Your Profile",
      currentName: "Current Name",
      currentEmail: "Email Address",
      updateNameLabel: "Update Your Full Name",
      updateButton: "Save Changes",
      updateSuccess: "Profile updated successfully!",
    },
    pro: {
      title: "Upgrade to Agri-AI Pro",
      description:
        "Unlock advanced features to get the most out of the Agri-AI Assistant.",
      feature1: "Detailed treatment plans for plant diseases.",
      feature2: "Priority support.",
      feature3: "Access to new beta features.",
      upgradeButton: "Upgrade Now for Pro Access",
      currentPlan: "Current Plan",
      freeTier: "Free Tier",
      proTier: "Pro Member",
      proMemberInfo:
        "You have access to all premium features, including detailed treatment plans.",
      success: "Upgrade successful! You now have access to all Pro features.",
    },

    // Payment Modal
    payment: {
      title: "Complete Your Upgrade",
      price: "100 ETB / month",
      instructions:
        "To upgrade to Pro, please complete the payment using Telebirr.",
      scanQR:
        "Scan the QR code below or use the Pay Bill option in your Telebirr app.",
      paybillNumber: "Pay Bill Number: +251916662982",
      transactionIdLabel: "Enter Your Telebirr Transaction ID",
      transactionIdPlaceholder: "e.g., TR123456789",
      confirmPaymentButton: "Confirm Payment",
      cancelButton: "Cancel",
      processing: "Verifying payment...",
      confirmDetailsTitle: "Confirm Your Details",
      confirmTransactionId:
        "You are about to confirm the upgrade with the following transaction ID:",
      confirmFinal:
        "Please ensure the ID is correct before proceeding. This action cannot be undone.",
      finalizeButton: "Finalize Payment",
      goBackButton: "Go Back",
    },

    // Errors
    errors: {
      title: "Error",
      API_KEY_MISSING: "API key is not configured. Please contact support.",
      PREDICTION_FAILED:
        "Failed to get a prediction. The model may be temporarily unavailable. Please try again later.",
      AGRIBOT_FAILED:
        "Failed to get a response from AgriBot. Please check your connection and try again.",
      ANALYSIS_FAILED:
        "Failed to analyze the image. The model may be unavailable or the image format is not supported.",
      SOIL_ANALYSIS_FAILED:
        "Failed to analyze the soil image. Please try again with a clearer image.",
      TREATMENT_PLAN_FAILED:
        "Failed to generate the Pro treatment plan. Please try again.",
      SPEECH_FAILED: "Failed to generate audio for this message.",
      GUIDE_FAILED: "Failed to generate the farming guide.",
      DISEASE_EXTRACTION_FAILED:
        "Could not identify a specific issue from the analysis to generate an image.",
      IMAGE_GENERATION_FAILED:
        "Failed to generate a visual reference image. The model may be temporarily unavailable.",
      UNKNOWN_ERROR: "An unknown error occurred. Please try again.",
      agriBotErrorPrefix: "Sorry, I encountered an error:",
      INVALID_FILE_TYPE: "Please upload a valid image file (e.g., JPEG, PNG).",
      CAMERA_ERROR:
        "Could not access camera. Please check permissions and ensure your device is not using it elsewhere.",
      CAMERA_UNSUPPORTED: "Camera not supported on this browser or device.",
      NO_IMAGE: "Please upload an image first.",
      LOCATION_PERMISSION_DENIED:
        "Location access was denied. Please enable it in your browser settings to use this feature.",
      LOCATION_FETCH_FAILED:
        "Could not determine your location. Please check your connection or enter data manually.",
      GEOLOCATION_UNSUPPORTED: "Geolocation is not supported by your browser.",
      speechPermissionDenied:
        "Microphone permission was denied. Please enable it in your browser settings to use this feature.",
      speechError: "A speech recognition error occurred",
    },
  },
  am: {
    // General
    appName: "አግሪ-ኤአይ ረዳት",
    appSubtitle:
      "ለሰብል ትንበያ፣ ለግብርና ጥያቄዎች እና ለተክል ጤና ትንተና ሁሉን-በአንድ የሆነ የኤአይ መሳሪያዎ።",
    footer:
      "agriculturor. — ከAI ጥቅም ጋር ከሚሻሉ መልኩ ግብርናን ለጥሩ መመርያ ማስቻል (Literal meaning: Empowering farmers with AI insights for better farming)",
    language: "ቋንቋ",
    welcomeMessage: "እንኳን ደህና መጡ",
    logout: "ውጣ",
    playAudio: "ድምጽ አጫውት",
    useCurrentLocation: "የአሁኑን አካባቢዬን ተጠቀም",
    fetchingLocation: "በማምጣት ላይ...",

    // Landing Page
    landing: {
      title: "ወደፊት ወደሆነው የግብርና ዓለም እንኳን ደህና መጡ",
      subtitle:
        "ለሰብሎችዎ የተሻለ ውሳኔ ለመስጠት የሰው ሰራሽ ዕውቀት ኃይልን ይጠቀሙ። ፈጣን ትንታኔ፣ ትንበያ እና የባለሙያ ምክር ያግኙ።",
      getStarted: "ይጀምሩ",
      feature1Title: "ብልህ የሰብል ተንባይ",
      feature1Desc:
        "እንደ ዝናብ መጠን እና የአፈር ንጥረ ነገሮች ያሉ የአካባቢ መረጃዎችን በማስገባት በጣም ተስማሚ ለሆኑ ሰብሎች በሰው ሰራሽ ዕውቀት የተደገፈ ምክሮችን ያግኙ።",
      feature2Title: "አግሪቦት ረዳት",
      feature2Desc:
        "ስለ ግብርና ጥያቄ አለዎት? በተለያዩ የግብርና ርዕሰ ጉዳዮች ላይ ፈጣን እና አስተማማኝ መልሶችን ለማግኘት ከኛ የሰው ሰራሽ ዕውቀት ረዳት ጋር ይወያዩ።",
      feature3Title: "የቅጠል ጤና ስካነር",
      feature3Desc:
        "ሊሆኑ የሚችሉ በሽታዎችን፣ ተባዮችን ወይም የተመጣጠነ ምግብ እጥረቶችን በእይታ ትንተና ወዲያውኑ ለመመርመር የቅጠል ፎቶ ይስቀሉ።",
    },

    // Auth
    login: "ግባ",
    register: "ተመዝገብ",
    emailLabel: "የኢሜይል አድራሻ",
    passwordLabel: "የይለፍ ቃል",
    nameLabel: "ሙሉ ስም",
    loginPrompt: "አካውንት አለዎት?",
    registerPrompt: "አካውንት የለዎትም?",
    backToHome: "ወደ መነሻ ተመለስ",
    defaultUsername: "ተጠቃሚ",

    // Tabs
    predictorTab: "ሰብል ተንባይ",
    agriBotTab: "አግሪቦት",
    scannerTab: "ቅጠል ስካነር",
    soilScannerTab: "የአፈር ስካነር",
    profileTab: "መገለጫ",

    // Visualizations
    visualizations: {
      title: "የውሂብ እይታዎች",
      heatmap: "የግንኙነት ሙቀት ካርታ",
      importance: "የባህሪ አስፈላጊነት",
      rainfallVsYield: "የዝናብ መጠን እና ምርት",
      tempVsYield: "የሙቀት መጠን እና ምርት",
      correlation: "ግንኙነት",
      importanceLabel: "አስፈላጊነት",
      yield: "ምርት",
      yieldData: "የምርት መረጃ",
    },

    // Crop Predictor
    inputParams: "የግቤት መለኪያዎች",
    rainfall: "የዝናብ መጠን (ሚሜ)",
    temperature: "የሙቀት መጠን (°C)",
    humidity: "እርጥበት (%)",
    nitrogen: "ናይትሮጅን (N) (ኪግ/ሄክ)",
    phosphorus: "ፎስፈረስ (P) (ኪግ/ሄክ)",
    potassium: "ፖታሲየም (K) (ኪግ/ሄክ)",
    ph: "የአፈር ፒኤች",
    soilType: "የአፈር ዓይነት",
    region: "ክልል",
    predictButton: "ምርጥ ሰብል ተንብይ",
    analyzingButton: "እየተተነተነ ነው...",
    awaitingPrediction: "ትንበያ በመጠባበቅ ላይ",
    awaitingPredictionDesc:
      'መለኪያዎችዎን ያስገቡ እና ውጤቶችን ለማየት "ምርጥ ሰብል ተንብይ" የሚለውን ጠቅ ያድርጉ።',
    recommendedCrop: "የሚመከር ሰብል",
    confidence: "እርግጠኝነት",
    expectedYield: "የሚጠበቅ ምርት",
    justification: "ምክንያት",
    generateGuideButton: "የግብርና መመሪያ ፍጠር",
    farmingGuideTitle: "የግብርና መመሪያ",
    generatingGuide: "መመሪያ በመፍጠር ላይ...",
    history: {
      title: "የትንበያ ታሪክ",
      show: "ታሪክን ተመልከት",
      hide: "ታሪክን ደብቅ",
      clear: "ታሪክን አጽዳ",
      noHistory: "እስካሁን ምንም ትንበያ አልተደረገም። ያለፉት ውጤቶችዎ እዚህ ይታያሉ።",
      predictedOn: "የተተነበየው በ",
    },
    soilTypes: ["ሸክላ", "አሸዋማ", "ሎም", "ደለል", "ፒት"],
    regions: ["ኦሮሚያ", "አማራ", "ደቡብ", "ትግራይ", "ሶማሌ", "አፋር"],

    // AgriBot
    agriBotTitle: "አግሪቦት ረዳት",
    agriBotWelcome: "ሰላም! እኔ አግሪቦት ነኝ። ዛሬ በግብርና ጥያቄዎችዎ እንዴት ልረዳዎት እችላለሁ?",
    agriBotPlaceholder: "አግሪቦትን ጥያቄ ይጠይቁ...",
    send: "ላክ",
    speakNow: "አሁን ይናገሩ...",
    startRecording: "የድምጽ ግቤትን ጀምር",
    stopRecording: "የድምጽ ግቤትን አቁም",

    // Leaf Scanner
    scannerTitle: "የቅጠል ጤና ስካነር",
    uploadPrompt: "ለመጫን ጠቅ ያድርጉ",
    uploadPromptDrag: "ወይም ጎትተው ያስቀምጡ",
    uploadFileType: "PNG, JPG or JPEG (MAX. 5MB)",
    analysisPrompt: "የትንተና ጥያቄ",
    plantNameLabel: "የተክል/ሰብል ስም (ለምሳሌ፣ በቆሎ፣ ቲማቲም)",
    plantNamePlaceholder: "የተክሉን ስም ያስገቡ",
    visualReferenceProTooltip:
      "የፕሮ ባህሪ፡ ለተሻለ ምስላዊ ማረጋገጫ የምርመራውን ጉዳይ እውነተኛ ምስል ይፈጥራል።",
    scanHistory: {
      title: "የስካን ታሪክ",
      show: "ታሪክን ተመልከት",
      hide: "ታሪክን ደብቅ",
      clear: "ታሪክን አጽዳ",
      noHistory: "እስካሁን ምንም ስካን አልተቀመጠም። ያለፉት ትንታኔዎችዎ እዚህ ይታያሉ።",
      viewScan: "ስካን ተመልከት",
    },
    scanner: {
      analysisPromptPrefix: "ይህንን ቅጠል ከ",
      defaultPrompt:
        "ይህን የቅጠል ምስል ለማንኛውም የበሽታ፣ የተባይ ወይም የተመጣጠነ ምግብ እጥረት ምልክቶች ይተንትኑ። ሊሆን የሚችል ምርመራ ያቅርቡ እና አስፈላጊ ከሆነ መፍትሄዎችን ይጠቁሙ።",
      useExamples: "ወይም ከምሳሌዎቻችን አንዱን ይሞክሩ",
      useThisExample: "ይህን ምሳሌ ተጠቀም",
      examples: [
        {
          name: "ጤናማ የበቆሎ ቅጠል",
          image: "https://placehold.co/600x400/a3e635/ffffff?text=ጤናማ+በቆሎ",
          prompt: "ይህ የበቆሎ ቅጠል ጤናማ ነው?",
          analysis: {
            analysis:
              "### ትንተና፡ ጤናማ\n\nይህ ጤናማ የበቆሎ ቅጠል ይመስላል። እንደ ሰሜናዊ የበቆሎ ቅጠል ብላይት፣ ግራጫ ቅጠል ስፖት ወይም ዝገት ያሉ የተለመዱ በሽታዎች ምንም ጉልህ ምልክቶች የሉም። ቀለሙ ወጥ የሆነ አረንጓዴ ነው፣ እና ምንም የሚታዩ ቁስሎች፣ ነጠብጣቦች ወይም የቀለም ለውጦች የሉም።",
            confidence: 98.5,
          },
        },
        {
          name: "ሰሜናዊ የበቆሎ ቅጠል ብላይት",
          image: "https://placehold.co/600x400/f59e0b/ffffff?text=የታመመ+በቆሎ",
          prompt: "ይህንን የበቆሎ ቅጠል የትኛው በሽታ አጠቃው?",
          analysis: {
            analysis:
              "### ምርመራ፡ ሰሜናዊ የበቆሎ ቅጠል ብላይት (NCLB)\n\n**ምልክቶች፡** ረዣዥም፣ ሞላላ፣ ግራጫ-አረንጓዴ ወይም ቡናማ ቁስሎች የሰሜናዊ የበቆሎ ቅጠል ብላይት ባህሪያት ናቸው፣ ይህም በቆሎ ላይ የተለመደ የፈንገስ በሽታ ነው።\n\n**ምክር፡** ስርጭቱን ይቆጣጠሩ። ለከፋ ጉዳዮች፣ ፈንገስ ማጥፊያ ለመጠቀም ያስቡ። የሰብል ማሽከርከር እና ተከላካይ ዝርያዎችን መጠቀም ውጤታማ የረጅም ጊዜ የመከላከያ ስልቶች ናቸው።",
            confidence: 92.0,
          },
        },
        {
          name: "የፖታስየም እጥረት",
          image: "https://placehold.co/600x400/facc15/ffffff?text=ጉድለት+ያለበት",
          prompt: "በዚህ ቅጠል ላይ ምን አይነት የተመጣጠነ ምግብ እጥረት ይታያል?",
          analysis: {
            analysis:
              "### ምርመራ፡ የፖታስየም (K) እጥረት\n\n**ምልክቶች፡** በታችኛው፣ በአሮጌ ቅጠሎች ጠርዝ ላይ ያለው ቢጫ ቀለም በቆሎ ላይ የፖታስየም እጥረት ክላሲክ ምልክት ነው። ፖታስየም በእጽዋቱ ውስጥ ተንቀሳቃሽ ነው፣ ስለዚህ እፅዋቱ ከድሮ ወደ አዲስ እድገት ያንቀሳቅሰዋል፣ ይህም ጉድለቱ መጀመሪያ በታችኛው ቅጠሎች ላይ እንዲታይ ያደርጋል።\n\n**ምክር፡** ጉድለቱን ለማረጋገጥ የአፈር ምርመራ ይመከራል። ከተረጋገጠ፣ በፖታስየም የበለጸገ ማዳበሪያ ይተግብሩ።",
            confidence: 95.8,
          },
        },
      ],
    },
    analysisButton: "ቅጠሉን ተንትን",
    scanAnotherLeaf: "ሌላ ቅጠል ስካን አድርግ",
    aiInspecting: "ሰው ሰራሽ ዕውቀት ቅጠሉን እየመረመረ ነው...",
    analysisResult: "የትንተና ውጤት",
    confidenceScore: "የእርግጠኝነት ደረጃ",
    feedbackPrompt: "ይህ ትንታኔ ጠቃሚ ነበር?",
    feedbackThanks: "ለአስተያየትዎ እናመሰግናለን!",
    useCamera: "ካሜራ ተጠቀም",
    capture: "ፎቶ አንሳ",
    closeCamera: "ካሜራ ዝጋ",
    getTreatmentButton: "የፕሮ ህክምና እቅድ ያግኙ",
    generatingTreatment: "የህክምና እቅድ በማመንጨት ላይ...",
    treatmentPlanTitle: "የፕሮ ህክምና እቅድ",
    visualReferenceTitle: "በAI የተፈጠረ ምስላዊ ማጣቀሻ",
    generatingVisual: "ምስላዊ እርዳታ በማመንጨት ላይ...",
    visualReferenceDisclaimer: "ማሳሰቢያ፡ ይህ ለሥዕላዊ መግለጫ በAI የተፈጠረ ምስል ነው።",
    upgradeModal: {
      title: "የፕሮ ባህሪ ተቆልፏል",
      body: "ወደ አግሪ-ኤአይ ፕሮ በማደግ የንግድ እና ኦርጋኒክ አማራጮችን ጨምሮ የተወሰኑ የህክምና ምክሮችን ያግኙ።",
      actionButton: "ለማሻሻል ወደ መገለጫ ይሂዱ",
      closeButton: "ምናልባት በኋላ",
    },

    // Soil Scanner
    soilScannerTitle: "የአፈር ስካነር",
    soilAnalysisPrompt: "ተጨማሪ ጥያቄ (ለምሳሌ፣ እዚህ ምን ማምረት እችላለሁ?)",
    soilScannerDefaultPrompt: "የዚህን አፈር ሙሉ ትንታኔ ያቅርቡ።",
    soilAnalysisButton: "አፈርን ተንትን",
    scanAnotherSoil: "ሌላ ናሙና ስካን አድርግ",
    aiAnalyzingSoil: "ኤአይ አፈሩን እየተነተነ ነው...",
    soilAnalysisResult: "የአፈር ትንተና ውጤት",

    // Profile Page
    profile: {
      title: "የተጠቃሚ መገለጫ",
      overview:
        "ይህ የእርስዎ የግል ቦታ ነው። መለያዎን ወቅታዊ ለማድረግ የመገለጫ ዝርዝሮችዎን እዚህ ይመልከቱ እና ያስተዳድሩ።",
      manageTitle: "መገለጫዎን ያስተዳድሩ",
      currentName: "የአሁኑ ስም",
      currentEmail: "የኢሜይል አድራሻ",
      updateNameLabel: "ሙሉ ስምዎን ያዘምኑ",
      updateButton: "ለውጦችን ያስቀምጡ",
      updateSuccess: "መገለጫው በተሳካ ሁኔታ ተዘምኗል!",
    },
    pro: {
      title: "ወደ አግሪ-ኤአይ ፕሮ ያሻሽሉ",
      description: "ከአግሪ-ኤአይ ረዳት ምርጡን ለማግኘት የላቁ ባህሪያትን ይክፈቱ።",
      feature1: "ለተክል በሽታዎች ዝርዝር የህክምና እቅዶች።",
      feature2: "ቅድሚያ የሚሰጠው ድጋፍ።",
      feature3: "የአዲስ ቤታ ባህሪያትን ማግኘት።",
      upgradeButton: "ለፕሮ መዳረሻ አሁን ያሻሽሉ",
      currentPlan: "የአሁኑ እቅድ",
      freeTier: "ነፃ ደረጃ",
      proTier: "የፕሮ አባል",
      proMemberInfo: "ዝርዝር የሕክምና ዕቅዶችን ጨምሮ ሁሉንም ዋና ዋና ባህሪያትን መጠቀም ይችላሉ።",
      success: "ማሻሻል ተሳክቷል! አሁን ሁሉንም የፕሮ ባህሪያት መጠቀም ይችላሉ።",
    },

    // Payment Modal
    payment: {
      title: "ማሻሻያዎን ያጠናቅቁ",
      price: "100 ብር / በወር",
      instructions: "ወደ ፕሮ ለማደግ እባክዎ ክፍያውን በቴሌብር ይጨርሱ።",
      scanQR: "ከታች ያለውን የQR ኮድ ይቃኙ ወይም በቴሌብር መተግበሪያዎ የክፍያ አማራጭ ይጠቀሙ።",
      paybillNumber: "የክፍያ ቁጥር: +251916662982",
      transactionIdLabel: "የቴሌብር ግብይት መለያዎን ያስገቡ",
      transactionIdPlaceholder: "ለምሳሌ፣ TR123456789",
      confirmPaymentButton: "ክፍያን አረጋግጥ",
      cancelButton: "ሰርዝ",
      processing: "ክፍያ በማረጋገጥ ላይ...",
      confirmDetailsTitle: "ዝርዝሮችዎን ያረጋግጡ",
      confirmTransactionId: "በሚከተለው የግብይት መለያ ማሻሻያውን ሊያረጋግጡ ነው:",
      confirmFinal:
        "እባክዎ ከመቀጠልዎ በፊት መለያው ትክክል መሆኑን ያረጋግጡ። ይህን እርምጃ መመለስ አይቻልም።",
      finalizeButton: "ክፍያን አጠናቅቅ",
      goBackButton: "ተመለስ",
    },

    // Errors
    errors: {
      title: "ስህተት",
      API_KEY_MISSING: "የኤፒአይ ቁልፍ አልተዋቀረም። እባክዎ ድጋፍ ሰጪን ያነጋግሩ።",
      PREDICTION_FAILED:
        "ትንበያ ማግኘት አልተቻለም። ሞዴሉ ለጊዜው ላይገኝ ይችላል። እባክዎ ቆይተው እንደገና ይሞክሩ።",
      AGRIBOT_FAILED:
        "ከአግሪቦት ምላሽ ማግኘት አልተቻለም። እባክዎ ግንኙነትዎን ይፈትሹ እና እንደገና ይሞክሩ።",
      ANALYSIS_FAILED: "ምስሉን መተንተን አልተቻለም። ሞዴሉ ላይገኝ ይችላል ወይም የምስል ቅርጸቱ አይደገፍም።",
      SOIL_ANALYSIS_FAILED:
        "የአፈሩን ምስል መተንተን አልተቻለም። እባክዎ ግልጽ በሆነ ምስል እንደገና ይሞክሩ።",
      TREATMENT_PLAN_FAILED: "የፕሮ ህክምና እቅድ መፍጠር አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
      SPEECH_FAILED: "ለዚህ መልእክት ድምጽ መፍጠር አልተቻለም።",
      GUIDE_FAILED: "የግብርና መመሪያውን መፍጠር አልተቻለም።",
      DISEASE_EXTRACTION_FAILED: "ምስል ለመፍጠር ከትንተናው አንድ የተወሰነ ጉዳይ መለየት አልተቻለም።",
      IMAGE_GENERATION_FAILED: "የምስል ማጣቀሻ መፍጠር አልተቻለም። ሞዴሉ ለጊዜው ላይገኝ ይችላል።",
      UNKNOWN_ERROR: "ያልታወቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
      agriBotErrorPrefix: "ይቅርታ, ስህተት አጋጥሞኛል:",
      INVALID_FILE_TYPE: "እባክዎ ትክክለኛ የምስል ፋይል (ለምሳሌ, JPEG, PNG) ይስቀሉ።",
      CAMERA_ERROR:
        "ካሜራውን መድረስ አልተቻለም። እባክዎ ፈቃዶችን ያረጋግጡ እና መሳሪያዎ በሌላ ቦታ እየተጠቀመበት አለመሆኑን ያረጋግጡ።",
      CAMERA_UNSUPPORTED: "ካሜራ በዚህ አሳሽ ወይም መሳሪያ ላይ አይደገፍም።",
      NO_IMAGE: "እባክዎ መጀመሪያ ምስል ይስቀሉ።",
      LOCATION_PERMISSION_DENIED:
        "የአካባቢ መዳረሻ ተከልክሏል። ይህን ባህሪ ለመጠቀም እባክዎ በአሳሽዎ ቅንብሮች ውስጥ ያንቁት።",
      LOCATION_FETCH_FAILED:
        "የእርስዎን አካባቢ ማወቅ አልተቻለም። እባክዎ ግንኙነትዎን ያረጋግጡ ወይም መረጃን በእጅ ያስገቡ።",
      GEOLOCATION_UNSUPPORTED: "ጂኦሎኬሽን በአሳሽዎ አይደገፍም።",
      speechPermissionDenied:
        "የማይክሮፎን ፈቃድ ተከልክሏል። ይህን ባህሪ ለመጠቀም እባክዎ በአሳሽዎ ቅንብሮች ውስጥ ያንቁት።",
      speechError: "የንግግር ማወቂያ ስህተት ተከስቷል።",
    },
  },
  om: {
    // General
    appName: "Gargaaraa Agri-AI",
    appSubtitle:
      "Meeshaa kee AI kan oomisha tilmaamuu, gaaffiiwwan qonnaa deebisuu, fi fayyaa biqiltuu xiinxaluuf gargaaru.",
    footer:
      "agricultor. — Qonnaan bultootaaf gargaarsa bu’aa qabeessa argamsiisuuf AI waliin deeggaruu. (Literal meaning: Supporting farmers with AI for better yields)",
    language: "Afaan",
    welcomeMessage: "Baga Nagaan Dhufte",
    logout: "Bahi",
    playAudio: "Sagalee taphachiisi",
    useCurrentLocation: "Iddoo Ko Jiru Fayyadami",
    fetchingLocation: "Fidaa jira...",

    // Landing Page
    landing: {
      title: "Baga Nagaan Gara Qonnaa Gara Fuulduraatti Dhuftan",
      subtitle:
        "Humna AI fayyadamuun oomisha keessaniif murtoo ogummaa qabu murteessaa. Xiinxala, tilmaamaafi gorsa ogeessaa yeroodhaan argadhaa.",
      getStarted: "Jalqabi",
      feature1Title: "Tilmaamaa Oomishaa Ogummaa Qabu",
      feature1Desc:
        "Ragaa naannoo kan akka roobaa fi albuuda biyyee galchuun gorsa AI irratti hundaa'e oomishaalee baay'ee mijatoo ta'aniif argadhaa.",
      feature2Title: "Gargaaraa AgriBot",
      feature2Desc:
        "Qonnaa ilaalchisee gaaffii qabduu? Deebiiwwan saffisaafi amansiisaa argachuuf gargaaraa AI keenya waliin haasa'aa.",
      feature3Title: "Skaannarii Fayyaa Baala",
      feature3Desc:
        "Dhukkuboota, ilbiisota, ykn hanqina nyaataa adda baasuuf suuraa baala biqiltuu fe'uun xiinxala yeroodhaan argadhaa.",
    },

    // Auth
    login: "SeenI",
    register: "Galmaawi",
    emailLabel: "Teessoo Imeeyilii",
    passwordLabel: "Jecha Darbii",
    nameLabel: "Maqaa Guutuu",
    loginPrompt: "Kanaan dura galmoofteettaa?",
    registerPrompt: "Akkaawuntii hin qabduu?",
    backToHome: "Gara Fuul-duraatti Deebi'i",
    defaultUsername: "Fayyadamaa",

    // Tabs
    predictorTab: "Oomisha Tilmaami",
    agriBotTab: "AgriBot",
    scannerTab: "Baala Sakatta'i",
    soilScannerTab: "Biyyee Sakatta'i",
    profileTab: "Piroofaayilii",

    // Visualizations
    visualizations: {
      title: "Agarsiisa Ragaa",
      heatmap: "Kaartaa Hoo'a Walitti Dhufeenyaa",
      importance: "Barbaachisummaa Amalootaa",
      rainfallVsYield: "Rooba fi Oomisha",
      tempVsYield: "Hoo'a fi Oomisha",
      correlation: "Walitti Dhufeenya",
      importanceLabel: "Barbaachisummaa",
      yield: "Oomisha",
      yieldData: "Ragaa Oomishaa",
    },

    // Crop Predictor
    inputParams: "Paramമീ터ii Galtee",
    rainfall: "Rooba (mm)",
    temperature: "Hoo'a (°C)",
    humidity: "Jiidha (%)",
    nitrogen: "Naayitiroojiinii (N) (kg/ha)",
    phosphorus: "Foosfarasii (P) (kg/ha)",
    potassium: "Pootaasiyeemii (K) (kg/ha)",
    ph: "pH Biyyee",
    soilType: "Gosa Biyyee",
    region: "Naannoo",
    predictButton: "Oomisha Ol'aanaa Tilmaami",
    analyzingButton: "Xiinxalamaa jira...",
    awaitingPrediction: "Tilmaama Eegaa",
    awaitingPredictionDesc:
      "Paramമീ터ii keessan galchaatii bu'aa argachuuf \"Oomisha Ol'aanaa Tilmaami\" cuqaasaa.",
    recommendedCrop: "Oomisha Gorfamu",
    confidence: "Amansiisummaa",
    expectedYield: "Oomisha Eegamu",
    justification: "Sababa",
    generateGuideButton: "Qajeelfama Qonnaa Uumi",
    farmingGuideTitle: "Qajeelfama Qonnaa",
    generatingGuide: "Qajeelfama uumaa jira...",
    history: {
      title: "Seenaa Tilmaamaa",
      show: "Seenaa Ilaali",
      hide: "Seenaa Dhoksi",
      clear: "Seenaa Haqii",
      noHistory:
        "Tilmaamni tokkollee hin taasifamne. Bu'aan kee darbe asitti mul'ata.",
      predictedOn: "Kan tilmaamame",
    },
    soilTypes: ["Suphee", "Cirracha", "Loamii", "Siltii", "Peatii"],
    regions: ["Oromiyaa", "Amaara", "SNNPR", "Tigraay", "Somaalee", "Afaar"],

    // AgriBot
    agriBotTitle: "Gargaaraa AgriBot",
    agriBotWelcome:
      "Akkam! Ana AgriBot. Gaaffiiwwan qonnaa keessaniif har'a akkamitti isin gargaaruu danda'aa?",
    agriBotPlaceholder: "AgriBot gaaffii gaafadhu...",
    send: "Ergi",
    speakNow: "Amma dubbadhu...",
    startRecording: "Galmee sagalee jalqabi",
    stopRecording: "Galmee sagalee dhaabi",

    // Leaf Scanner
    scannerTitle: "Skaannarii Fayyaa Baala",
    uploadPrompt: "Fe'uuf cuqaasi",
    uploadPromptDrag: "yookan harkisiitii kaa'i",
    uploadFileType: "PNG, JPG ykn JPEG (MAX. 5MB)",
    analysisPrompt: "Ajaja Xiinxalaa",
    plantNameLabel: "Maqaa Biqiltuu/Oomishaa (fkn, Boqqolloo, Timaatima)",
    plantNamePlaceholder: "Maqaa biqiltuu galchi",
    visualReferenceProTooltip:
      "Amala Pro: Mirkaneessa mul'ataa gaarii argachuuf suuraa dhugaa fakkaatu kan rakkoo adda baafame uuma.",
    scanHistory: {
      title: "Seenaa Sakatta'insaa",
      show: "Seenaa Ilaali",
      hide: "Seenaa Dhoksi",
      clear: "Seenaa Haqii",
      noHistory:
        "Sakatta'insi tokkollee hin kuufamne. Xiinxalli kee darbe asitti mul'ata.",
      viewScan: "Sakatta'insa Ilaali",
    },
    scanner: {
      analysisPromptPrefix: "Baala kana xiinxali kan",
      defaultPrompt:
        "Suuraa baala kanaa mallattoolee dhukkubaa, ilbiisotaa, ykn hanqina nyaataa kamiyyuu xiinxali. Yoo barbaachise, tilmaama yaalaa kenniifi furmaata yaada.",
      useExamples: "Yookan fakkeenyota keenya keessaa tokko yaali",
      useThisExample: "Fakkeenyattii Fayyadami",
      examples: [
        {
          name: "Baala Boqqolloo Fayyaa",
          image: "https://placehold.co/600x400/a3e635/ffffff?text=Baala+Fayyaa",
          prompt: "Baalli boqqolloo kun fayyaa qabaa?",
          analysis: {
            analysis:
              "### Xiinxala: Fayyaa Qaba\n\nKun baala boqqolloo fayyaa qabu fakkaata. Mallattooleen dhukkuboota beekamoo kan akka Northern Corn Leaf Blight, Gray Leaf Spot, ykn rust hin mul'atan. Rangi isaa magariisa walqixa ta'ee, madaa, qunxurroo ykn jijjiirama rangii hin qabu.",
            confidence: 98.5,
          },
        },
        {
          name: "Dhukkuba Baala Boqqolloo Kaabaa",
          image:
            "https://placehold.co/600x400/f59e0b/ffffff?text=Baala+Dhukkubsate",
          prompt: "Dhukkubni kamtu baala boqqolloo kana miidhe?",
          analysis: {
            analysis:
              "### Adda baafannaa: Dhukkuba Baala Boqqolloo Kaabaa (NCLB)\n\n**Mallattoolee:** Madaawwan dheeraa, ovaalii, magariisa-diimaa ykn daalachaa'aa ta'an dhukkuba baala boqqolloo kaabaa agarsiisu, kan boqqolloorratti baay'ee mul'atuudha.\n\n**Gorsa:** Babal'ina isaa hordofi. Yoo hammaate, qoricha fangasii fayyadami. Oomisha waljijjiiruu fi sanyii madaqsuu fayyadamuun ittisa yeroo dheeraatiif gargaara.",
            confidence: 92.0,
          },
        },
        {
          name: "Hanqina Pootaasiyeemii",
          image:
            "https://placehold.co/600x400/facc15/ffffff?text=Hanqina+Albuudaa",
          prompt: "Hanqinni albuudaa kamtu baala kanarratti mul'ata?",
          analysis: {
            analysis:
              "### Adda baafannaa: Hanqina Pootaasiyeemii (K)\n\n**Mallattoolee:** Cinoo baala isa gadii, kan dulloome keessatti adii ta'uun mallattoo beekamaa hanqina Pootaasiyeemii boqqolloorratti agarsiisa. Pootaasiyeemiin biqiltuu keessa kan socho'u waan ta'eef, biqiltuun baala dulloome irraa gara baala haaraatti dabarsa, kunis hanqinni baala gadiirratti akka mul'atu taasisa.\n\n**Gorsa:** Hanqina mirkaneessuuf qorannoo biyyee taasisuun ni gorfama. Yoo mirkanaa'e, xaa'oo pootaasiyeemiin badhaadhe fayyadami.",
            confidence: 95.8,
          },
        },
      ],
    },
    analysisButton: "Baala Xiinxali",
    scanAnotherLeaf: "Baala Biraa Sakatta'i",
    aiInspecting: "AI baala qorachaa jira...",
    analysisResult: "Bu'aa Xiinxalaa",
    confidenceScore: "Sadarkaa Amansiisummaa",
    feedbackPrompt: "Xiinxalli kun gargaareeraa?",
    feedbackThanks: "Yaada keessaniif galatoomaa!",
    useCamera: "Kaameeraa Fayyadami",
    capture: "Suura Kaasi",
    closeCamera: "Kaameeraa Cufi",
    getTreatmentButton: "Karoora Yaalaa Pro Argadhu",
    generatingTreatment: "Karoora yaalaa uumaa jira...",
    treatmentPlanTitle: "Karoora Yaalaa Pro",
    visualReferenceTitle: "Wabii Mul'ataa AI-n Uumame",
    generatingVisual: "Gargaarsa mul'ataa uumaa jira...",
    visualReferenceDisclaimer:
      "Hubachiisa: Kun suuraa AI-n uumame kan agarsiisaaf qophaa'eedha.",
    upgradeModal: {
      title: "Amala Pro Cufamaadha",
      body: "Gara Agri-AI Pro tti guddisuun gorsa yaalaa addaa argadhaa, filannoolee daldalaa fi orgaanikii dabalatee.",
      actionButton: "Guddisuuf Gara Piroofaayiliitti Deemi",
      closeButton: "Tarii Booda",
    },

    // Soil Scanner
    soilScannerTitle: "Skaannarii Biyyee",
    soilAnalysisPrompt: "Ajaja Dabalataa (fkn, asitti maal oomishuu danda'aa?)",
    soilScannerDefaultPrompt: "Xiinxala guutuu biyyee kanaa kenni.",
    soilAnalysisButton: "Biyyee Xiinxali",
    scanAnotherSoil: "Sampiloota Biraa Sakatta'i",
    aiAnalyzingSoil: "AI biyyee xiinxalaa jira...",
    soilAnalysisResult: "Bu'aa Xiinxala Biyyee",

    // Profile Page
    profile: {
      title: "Piroofaayilii Fayyadamaa",
      overview:
        "Kun iddoo kee dhuunfaati. Akkaawuntii kee haaromsuuf odeeffannoo piroofaayilii kee asitti ilaaliifi hooggani.",
      manageTitle: "Piroofaayilii Kee Hooggani",
      currentName: "Maqaa Ammaa",
      currentEmail: "Teessoo Imeeyilii",
      updateNameLabel: "Maqaa Guutuu Kee Haaromsi",
      updateButton: "Jijjiirama Qusadhu",
      updateSuccess: "Piroofaayiliin milkaa'inaan haaromfameera!",
    },
    pro: {
      title: "Gara Agri-AI Pro tti Guddisi",
      description:
        "Amaloota sadarkaa olaanaa banaa gochuun gargaaraa Agri-AI irraa faayidaa guddaa argadhu.",
      feature1: "Karoora yaalaa dhukkuboota biqiltuu gadi fageenyaan.",
      feature2: "Deeggarsa dursi kennamuuf.",
      feature3: "Amaloota beetaa haaraa argachuu.",
      upgradeButton: "Amma Guddisiitii Pro Argadhu",
      currentPlan: "Karoora Ammaa",
      freeTier: "Sadarkaa Bilisaa",
      proTier: "Miseensa Pro",
      proMemberInfo:
        "Karoora yaalaa gadi fageenyaa dabalatee amaloota piireemiyeemii hundatti fayyadamuu dandeessa.",
      success:
        "Guddinni milkaa'eera! Amma amaloota Pro hundatti fayyadamuu dandeessa.",
    },

    // Payment Modal
    payment: {
      title: "Guddina Kee Xumuri",
      price: "100 ETB / Jimaan",
      instructions:
        "Gara Pro tti guddisuuf, kaffaltii Telebirr fayyadamuun xumuri.",
      scanQR:
        "Koodii QR armaan gadii sakatta'i ykn appii Telebirr keessatti filannoo Kaffaltii Bilii fayyadami.",
      paybillNumber: "Lakk. Bilii Kaffaltii: +251916662982",
      transactionIdLabel: "ID Transaakshinii Telebirr Kee Galchi",
      transactionIdPlaceholder: "fkn, TR123456789",
      confirmPaymentButton: "Kaffaltii Mirkaneessi",
      cancelButton: "Haqi",
      processing: "Kaffaltii mirkaneessaa jira...",
      confirmDetailsTitle: "Odeeffannoo Kee Mirkaneessi",
      confirmTransactionId:
        "ID transaakshinii armaan gadiitiin guddina mirkaneessuuf jetta:",
      confirmFinal:
        "Osoo hin itti fufin dura IDn sirrii ta'uu isaa mirkaneeffadhu. Gocha kana deebisuun hin danda'amu.",
      finalizeButton: "Kaffaltii Xumuri",
      goBackButton: "Deebi'i",
    },

    // Errors
    errors: {
      title: "Dogoggora",
      API_KEY_MISSING: "Furtuun API hin qindaa'ine. Maaloo deeggarsa qunnami.",
      PREDICTION_FAILED:
        "Tilmaama argachuun hin danda'amne. Moodeelli yeroof hin argamu ta'a. Maaloo booda irra deebi'ii yaali.",
      AGRIBOT_FAILED:
        "AgriBot irraa deebii argachuun hin danda'amne. Maaloo qunnamtii kee mirkaneeffadhuutii irra deebi'ii yaali.",
      ANALYSIS_FAILED:
        "Suuraa xiinxaluun hin danda'amne. Moodeelli hin argamu ykn foormaatiin suuraa hin deeggaramu ta'a.",
      SOIL_ANALYSIS_FAILED:
        "Suuraa biyyee xiinxaluun hin danda'amne. Maaloo suuraa ifa ta'een irra deebi'ii yaali.",
      TREATMENT_PLAN_FAILED:
        "Karoora yaalaa Pro uumuun hin danda'amne. Maaloo irra deebi'ii yaali.",
      SPEECH_FAILED: "Sagalee ergaa kanaaf uumuun hin danda'amne.",
      GUIDE_FAILED: "Qajeelfama qonnaa uumuun hin danda'amne.",
      DISEASE_EXTRACTION_FAILED:
        "Suuraa uumuuf xiinxala keessaa rakkoo addaa adda baasuun hin danda'amne.",
      IMAGE_GENERATION_FAILED:
        "Wabii suuraa uumuun hin danda'amne. Moodeelli yeroof hin argamu ta'a.",
      UNKNOWN_ERROR:
        "Dogoggorri hin beekamne uumameera. Maaloo irra deebi'ii yaali.",
      agriBotErrorPrefix: "Dhiifama, dogoggorri na mudateera:",
      INVALID_FILE_TYPE:
        "Maaloo faayilii suuraa sirrii ta'e (fkn, JPEG, PNG) fe'i.",
      CAMERA_ERROR:
        "Kaameeraa fayyadamuun hin danda'amne. Maaloo hayyama mirkaneeffadhuu meeshaan kee bakka biraatti fayyadamaa akka hin jirre mirkaneessi.",
      CAMERA_UNSUPPORTED:
        "Kaameeraan biraawzarii ykn meeshaa kanarratti hin deeggaramu.",
      NO_IMAGE: "Maaloo dura suuraa fe'i.",
      LOCATION_PERMISSION_DENIED:
        "Hayyamni iddoo eeyyamamuu dide. Amala kana fayyadamuuf qindaa'ina biraawzarii kee keessatti banaa godhi.",
      LOCATION_FETCH_FAILED:
        "Iddoo kee adda baasuun hin danda'amne. Maaloo qunnamtii kee mirkaneeffadhuu ykn ragaa harkaan galchi.",
      GEOLOCATION_UNSUPPORTED:
        "Biraawzariin kee Jiyoolookeeshinii hin deeggaru.",
      speechPermissionDenied:
        "Hayyamni maaykiroofoonii eeyyamamuu dide. Amala kana fayyadamuuf qindaa'ina biraawzarii kee keessatti banaa godhi.",
      speechError: "Dogoggorri beekumsa sagalee uumameera",
    },
  },
};

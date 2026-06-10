const quizData = {
  1: [
    {
      question: "Which organ pumps blood to your whole body?",
      options: ["Stomach", "Heart", "Brain", "Lungs"],
      answerIndex: 1,
      hints: ["It beats inside your chest.", "It is a muscular pump."],
      explanation: "The heart is a muscle that pumps blood. Other organs do different jobs."
    },
    {
      question: "What do your lungs do?",
      options: [
        "Digest the food you eat",
        "Take in oxygen and remove carbon dioxide",
        "Filter liquid waste from blood",
        "Control your thoughts"
      ],
      answerIndex: 1,
      hints: ["They expand when you breathe in.", "They handle air and respiration."],
      explanation: "Lungs are for breathing. The stomach digests food, kidneys filter waste."
    },
    {
      question: "Where does most digestion happen?",
      options: ["Stomach", "Mouth", "Small intestine", "Large intestine"],
      answerIndex: 2,
      hints: ["It is a very long, narrow coiled tube.", "This is where nutrients enter the blood."],
      explanation: "The small intestine absorbs nutrients. The stomach starts digestion, but the small intestine does most of the work."
    },
    {
      question: "Which organ filters waste from your blood to make urine?",
      options: ["Liver", "Heart", "Kidneys", "Brain"],
      answerIndex: 2,
      hints: ["They are bean-shaped organs.", "They produce pee."],
      explanation: "Kidneys act like a filter. The liver processes nutrients, not waste removal."
    },
    {
      question: "Which organ controls your thoughts, memories, and movements?",
      options: ["Brain", "Heart", "Lungs", "Skin"],
      answerIndex: 0,
      hints: ["It is protected by the skull.", "It is the boss of your nervous system."],
      explanation: "The brain is the body's control center. The heart pumps blood, but it doesn't control thoughts."
    }
  ],
  2: [
    {
      question: "What is the correct order of the digestive system?",
      options: [
        "Mouth → Stomach → Esophagus → Large intestine → Small intestine",
        "Mouth → Esophagus → Stomach → Small intestine → Large intestine",
        "Esophagus → Mouth → Stomach → Small intestine → Large intestine",
        "Mouth → Esophagus → Small intestine → Stomach → Large intestine"
      ],
      answerIndex: 1,
      hints: ["Food enters the mouth first, then goes down the esophagus tube.", "The small intestine precedes the large intestine."],
      explanation: "Food moves in one direction. It never goes back up to the liver or directly from mouth to small intestine."
    },
    {
      question: "What does the stomach do?",
      options: [
        "Absorbs water from food",
        "Breaks down food with acid and churns it",
        "Filters toxins from the blood",
        "Cuts food using teeth"
      ],
      answerIndex: 1,
      hints: ["It acts like a muscular mixing blender.", "It contains strong hydrochloric acid."],
      explanation: "The stomach is a muscular bag filled with acid. It does not absorb water (that's the large intestine)."
    },
    {
      question: "Which organ absorbs water from leftover waste?",
      options: ["Stomach", "Small intestine", "Large intestine", "Esophagus"],
      answerIndex: 2,
      hints: ["It is the final main part of the digestion tube.", "It forms solid waste by soaking up liquid."],
      explanation: "The large intestine pulls water back into your body. The small intestine absorbs nutrients."
    },
    {
      question: "What are the tiny finger-like bumps in the small intestine called?",
      options: ["Tentacles", "Villi", "Hairs", "Pores"],
      answerIndex: 1,
      hints: ["The word starts with a 'V'.", "They look like tiny velvet folds that absorb nutrients."],
      explanation: "Villi increase surface area to absorb nutrients. They are not called 'hairs' or 'tentacles.'"
    },
    {
      question: "How long does digestion take from mouth to exit?",
      options: ["10 minutes", "About 24–72 hours", "One full week", "Exactly 1 hour"],
      answerIndex: 1,
      hints: ["It is a slow process that takes 1 to 3 days.", "It takes longer than a few hours, but less than a week."],
      explanation: "Digestion is not instant (not 10 minutes) nor a full week. It takes 1–3 days."
    }
  ],
  3: [
    {
      question: "Which food group gives you long-lasting energy?",
      options: [
        "Grains (bread, rice, pasta)",
        "Protein (chicken, beans)",
        "Dairy (milk, cheese)",
        "Sweets (soda, candy)"
      ],
      answerIndex: 0,
      hints: ["These contain complex carbohydrates.", "Athletes eat pasta before a big match for this."],
      explanation: "Grains are carbohydrates for energy. Protein builds muscle, dairy builds bones."
    },
    {
      question: "Why do you need fruits and vegetables?",
      options: [
        "They are the main source of protein",
        "They provide vitamins and fiber",
        "They have a lot of calcium for bones",
        "They are high in unhealthy fats"
      ],
      answerIndex: 1,
      hints: ["They help protect you from getting sick.", "They provide vitamins and aid digestion via fiber."],
      explanation: "Fruits and veggies are not for protein or fat. They keep your immune system strong."
    },
    {
      question: "Which food is the best source of calcium for strong bones?",
      options: ["Apple", "Yogurt", "Chicken", "Bread"],
      answerIndex: 1,
      hints: ["It is a dairy product.", "It is made from milk."],
      explanation: "Yogurt has calcium. Apples have fiber, chicken has protein, bread has carbs."
    },
    {
      question: "What is an example of healthy protein?",
      options: ["Candy", "French fries", "Fish", "White bread"],
      answerIndex: 2,
      hints: ["It swims in water.", "It is a lean seafood meat."],
      explanation: "Fish is lean protein. Candy is sugar, fries are fat, white bread is a refined grain."
    },
    {
      question: "Which drink is healthiest for your body?",
      options: ["Soda", "Fruit juice", "Water", "Sports drinks"],
      answerIndex: 2,
      hints: ["It has zero sugar and zero calories.", "Your body is made mostly of this liquid."],
      explanation: "Water hydrates without sugar. Soda, juice, and sports drinks have added sugar."
    }
  ],
  4: [
    {
      question: "How many bones does an adult human have?",
      options: ["100", "206", "500", "300"],
      answerIndex: 1,
      hints: ["It's more than 200.", "Babies start with about 300, but some fuse together as they grow to this number."],
      explanation: "Babies have more (~300), adults have 206. 100 is too few, 500 is too many."
    },
    {
      question: "What do joints do?",
      options: [
        "Create blood cells",
        "Allow bones to move",
        "Store calcium",
        "Connect muscles to tendons"
      ],
      answerIndex: 1,
      hints: ["They connect bones and act like hinges.", "Without them, you couldn't bend your knees or elbows."],
      explanation: "Joints are the hinges of your body. They don't make blood (bone marrow does) or store calcium."
    },
    {
      question: "Which joint is in your shoulder?",
      options: ["Hinge joint", "Fixed joint", "Ball-and-socket joint", "Saddle joint"],
      answerIndex: 2,
      hints: ["It allows you to rotate your arm in a full circle.", "One bone ends in a cup-like socket."],
      explanation: "Shoulder moves in many directions like a ball in a cup. Hinge joints (knee, elbow) only bend one way."
    },
    {
      question: "What protects your heart and lungs?",
      options: ["Ribs", "Skull", "Spine", "Shin bone"],
      answerIndex: 0,
      hints: ["They form a cage around your chest.", "You can feel them on the sides of your chest."],
      explanation: "The rib cage is a bony shield. The skull protects the brain, the spine protects the spinal cord."
    },
    {
      question: "Why is the spine made of many small bones?",
      options: [
        "To make you taller",
        "To allow you to bend and twist",
        "So it can grow faster",
        "To make it solid and rigid"
      ],
      answerIndex: 1,
      hints: ["Think about flexibility versus rigidity.", "Many small vertebrae let you touch your toes."],
      explanation: "Many small vertebrae = flexibility. One solid bone would be rigid."
    }
  ],
  5: [
    {
      question: "How do muscles move bones?",
      options: [
        "Muscles push on bones",
        "Muscles pull on bones when they contract",
        "Muscles blow air onto bones",
        "Muscles heat up the bones"
      ],
      answerIndex: 1,
      hints: ["Muscles can only shorten/tighten (contract).", "They never push, they only do one action."],
      explanation: "Muscles never push; they only pull. Tendons connect muscle to bone."
    },
    {
      question: "What is a pair of muscles that work opposite each other called?",
      options: ["Antagonistic pair", "Friendly pair", "Pushing pair", "Linked pair"],
      answerIndex: 0,
      hints: ["The word sounds like 'antagonist' (opponent).", "When one contracts, the other relaxes."],
      explanation: "Bicep and tricep are an example: one pulls, the other relaxes. 'Friendly pair' is not a real term."
    },
    {
      question: "Which muscle is found in your heart?",
      options: ["Skeletal muscle", "Smooth muscle", "Cardiac muscle", "Involuntary organ tissue"],
      answerIndex: 2,
      hints: ["It has a medical name related to heart care.", "This muscle never gets tired and works 24/7."],
      explanation: "Cardiac muscle is special — it never gets tired. Skeletal muscle moves arms/legs. Smooth muscle is in organs."
    },
    {
      question: "What happens when you exercise your muscles regularly?",
      options: [
        "They grow more bones",
        "They get stronger and larger",
        "They turn into tendons",
        "They become stiff and cannot bend"
      ],
      answerIndex: 1,
      hints: ["Think of what happens to weightlifters' arms.", "They adapt to the workout work."],
      explanation: "Exercise does not add bones. It strengthens muscles and improves health."
    },
    {
      question: "What connects muscle to bone?",
      options: ["Ligament", "Cartilage", "Tendon", "Joint"],
      answerIndex: 2,
      hints: ["It is a tough, white cord.", "Ligaments connect bone-to-bone; this connects muscle-to-bone."],
      explanation: "Tendons are tough cords. Ligaments connect bone to bone. Cartilage cushions joints."
    }
  ],
  6: [
    {
      question: "What muscle helps pull air into your lungs?",
      options: ["Bicep", "Diaphragm", "Heart", "Ribs"],
      answerIndex: 1,
      hints: ["It is a sheet of muscle under your lungs.", "It moves down when you breathe in."],
      explanation: "The diaphragm is a dome-shaped muscle under your lungs. Your heart does not help breathing."
    },
    {
      question: "When you inhale (breathe in), your diaphragm…",
      options: [
        "Relaxes and moves up",
        "Contracts and moves down",
        "Disappears",
        "Expands and fills with blood"
      ],
      answerIndex: 1,
      hints: ["Contracting shortens it, pulling it down.", "This increases chest volume to suck in air."],
      explanation: "When diaphragm contracts, it creates space for lungs to expand. It does not relax or move up until exhale."
    },
    {
      question: "What gas do you breathe out?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
      answerIndex: 2,
      hints: ["It's a waste gas produced by your cells.", "Plants absorb this gas for photosynthesis."],
      explanation: "Your body uses oxygen and makes CO2 as waste. We breathe in oxygen, out carbon dioxide."
    },
    {
      question: "Which part of the body takes oxygen from the air?",
      options: ["Stomach", "Heart", "Lungs", "Brain"],
      answerIndex: 2,
      hints: ["They expand like balloons when you inhale.", "They contain alveoli."],
      explanation: "Lungs have tiny air sacs (alveoli) that transfer oxygen to blood."
    },
    {
      question: "Why do you breathe faster when you run?",
      options: [
        "Your lungs are tired",
        "Your heart slows down",
        "Your muscles need more oxygen",
        "To cool down your brain"
      ],
      answerIndex: 2,
      hints: ["Your active muscles are working hard.", "Muscle cells need oxygen to produce energy."],
      explanation: "Running muscles burn energy faster and require more oxygen. Not because lungs are tired or heart slows down."
    }
  ],
  7: [
    {
      question: "How does exercise help your brain?",
      options: [
        "It makes your skull thicker",
        "It improves memory and focus",
        "It makes your brain smaller",
        "It does not help the brain"
      ],
      answerIndex: 1,
      hints: ["It increases blood flow to your head.", "It helps you concentrate in school."],
      explanation: "Exercise sends more blood and oxygen to the brain. It doesn't make your skull thicker or brain smaller."
    },
    {
      question: "How many minutes of exercise do kids need per day?",
      options: ["10 minutes", "60 minutes", "120 minutes", "20 minutes"],
      answerIndex: 1,
      hints: ["It equals exactly 1 hour.", "It is the standard health guideline for school kids."],
      explanation: "Doctors recommend 60 minutes of moderate to vigorous activity daily. 20 minutes is too little, 120 is fine but not required."
    },
    {
      question: "Which activity improves both strength and flexibility?",
      options: ["Gymnastics", "Running", "Video games", "Weightlifting"],
      answerIndex: 0,
      hints: ["It involves tumbles, splits, and bars.", "It requires bendy muscles and strong core lifts."],
      explanation: "Gymnastics uses stretching and strength. Video games are sedentary, running is cardio, weightlifting is mostly strength."
    },
    {
      question: "Why should you drink water during exercise?",
      options: [
        "To wash down food",
        "To replace water lost through sweat",
        "To make you run faster instantly",
        "To cool the water bottle"
      ],
      answerIndex: 1,
      hints: ["Your body releases water to cool itself down.", "Dehydration must be prevented."],
      explanation: "Sweat cools you down but removes water. You drink to avoid dehydration."
    },
    {
      question: "Which is a sign you are exercising too hard?",
      options: [
        "Sweating",
        "Fast heartbeat",
        "Feeling dizzy or nauseous",
        "Breathing deeply"
      ],
      answerIndex: 2,
      hints: ["It's a warning signal that something is wrong.", "You feel like throwing up or passing out."],
      explanation: "Dizziness means stop and rest. Sweating and a fast heartbeat are normal and healthy."
    }
  ]
};

// Share globally
window.quizData = quizData;

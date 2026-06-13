export const plans = [
    {
        id: 0,
        name: "Free",
        price: "₹0",
        period: "/month",
        description: "Start your fitness journey with essential home workouts.",
        features: [
            { name: "Strength & Cardio Workouts", included: true },
            { name: "Basic Nutrition (Whole Foods)", included: true },
            { name: "Hydration Tracking Guide", included: true },
            { name: "HIIT Fat Burner Workouts", included: false },
            { name: "Yoga & Recovery Sessions", included: false },
            { name: "Advanced Protein Guide", included: false }
        ],
        details: {
            benefits: [
                "Access to Strength Transformation and Cardio Blast workouts.",
                "Basic nutrition guides for Whole Foods and Hydration.",
                "Community support access.",
                "Progress tracking for weight and BMI."
            ],
            terms: "Free forever."
        },
        highlights: [
            { title: "Zero Cost Entry", description: "Start your journey with absolutely no financial commitment." },
            { title: "Home Friendly", description: "Workouts designed to be done with minimal equipment." },
            { title: "Community", description: "Join a vibrant online community of fitness enthusiasts." }
        ],
        recommended: false
    },
    {
        id: 1,
        name: "Basic",
        price: "₹149",
        period: "/month",
        description: "Unlock faster results with high-intensity interval training.",
        features: [
            { name: "Strength & Cardio Workouts", included: true },
            { name: "Basic Nutrition (Whole Foods)", included: true },
            { name: "HIIT Fat Burner Workouts", included: true },
            { name: "Hydration Tracking Guide", included: true },
            { name: "Yoga & Recovery Sessions", included: false },
            { name: "Advanced Protein Guide", included: false }
        ],
        details: {
            benefits: [
                "Everything in Free.",
                "Unlock High-Intensity Interval Training (HIIT) workouts.",
                "Burn more calories in less time.",
                "Ad-free experience."
            ],
            terms: "Billed monthly. Cancel anytime."
        },
        highlights: [
            { title: "Fat Burning", description: "Unlock our specialized fat-burning HIIT routines." },
            { title: "Efficiency", description: "Short, intense workouts that fit your busy schedule." },
            { title: "No Equipment", description: "Many HIIT workouts require no equipment at all." }
        ],
        recommended: false
    },
    {
        id: 2,
        name: "Pro",
        price: "₹299",
        period: "/month",
        description: "Complete access to all workout styles and nutrition guides.",
        features: [
            { name: "All Workout Plans (HIIT, Yoga)", included: true },
            { name: "Advanced Protein Guide", included: true },
            { name: "Recovery & Flexibility Routines", included: true },
            { name: "Priority Support", included: true },
            { name: "Custom Diet Plan", included: false },
            { name: "1-on-1 Coaching", included: false }
        ],
        details: {
            benefits: [
                "Everything in Basic.",
                "Unlock Yoga for Recovery workouts.",
                "Access to Advanced Protein Intake nutrition guide.",
                "Full library of flexibility routines.",
                "Priority email support."
            ],
            terms: "Billed monthly. 3-month commitment required."
        },
        highlights: [
            { title: "Total Access", description: "Unlock every workout plan including Yoga and Recovery." },
            { title: "Expert Nutrition", description: "Get our comprehensive Protein Intake guide." },
            { title: "Balance", description: "Combine intense workouts with necessary recovery." }
        ],
        recommended: true
    },
    {
        id: 3,
        name: "Elite",
        price: "₹999",
        period: "/month",
        description: "Personalized coaching and plans for maximum transformation.",
        features: [
            { name: "All Workout Plans & Guides", included: true },
            { name: "Custom Nutrition Plan", included: true },
            { name: "Weekly Check-ins", included: true },
            { name: "1-on-1 Coaching Chat", included: true },
            { name: "Form Analysis Video Review", included: true },
            { name: "Priority Support", included: true }
        ],
        details: {
            benefits: [
                "Everything in Pro.",
                "Weekly check-ins with a certified coach.",
                "Customized Nutrition & Diet Plan created just for you.",
                "Personalized workout schedule adjustments.",
                "Direct chat access to your coach."
            ],
            terms: "Billed monthly. 6-month commitment required."
        },
        highlights: [
            { title: "Personalized", description: "Plans tailored specifically to your body and goals." },
            { title: "Accountability", description: "Weekly check-ins keep you on track." },
            { title: "Expert Access", description: "Direct line to a certified fitness coach." }
        ],
        recommended: false
    }
];

import { useParams } from "react-router-dom";

const blogPosts = [
    {
        id: 1,
        title: "Understanding Anxiety: A Guide for Young Adults",
        content:
            "Anxiety is a common challenge for young adults, often triggered by school, relationships, or uncertainty about the future. It can show up as racing thoughts, restlessness, sleep problems, or constant worry. While occasional stress is normal, ongoing anxiety can affect focus, mood, and daily life. Simple steps like mindfulness, exercise, balanced routines, and limiting caffeine can help ease symptoms. Talking to trusted friends or professionals provides valuable support. If anxiety feels overwhelming or lasts for weeks, reaching out for professional help is important. Remember, acknowledging anxiety isn’t weakness—it’s the first step toward resilience, growth, and better mental well-being.Anxiety is a common challenge for young adults, often triggered by school, relationships, or uncertainty about the future. It can show up as racing thoughts, restlessness, sleep problems, or constant worry. While occasional stress is normal, ongoing anxiety can affect focus, mood, and daily life. Simple steps like mindfulness, exercise, balanced routines, and limiting caffeine can help ease symptoms. Talking to trusted friends or professionals provides valuable support. If anxiety feels overwhelming or lasts for weeks, reaching out for professional help is important. Remember, acknowledging anxiety isn’t weakness—it’s the first step toward resilience, growth, and better mental well-being.",
        author: "Sarah Johnson",
        date: "2024-01-15",
        readTime: "5 min read",
        category: "Mental Health",
    },
    {
        id: 2,
        title: "Building Healthy Relationships During Difficult Times",
        content:
            "Relationships often face pressure during difficult times, whether from stress, loss, or uncertainty. The foundation of a healthy bond is open communication. Talking honestly about your worries while listening with patience prevents misunderstandings. It’s equally important to respect boundaries—sometimes people need space to process emotions. Small gestures of kindness, like checking in or sharing a meal, can strengthen trust. Practicing empathy helps you see that irritability or withdrawal often comes from stress, not lack of care. Taking care of yourself also plays a role; when you feel balanced, you contribute positively to the relationship. If challenges become overwhelming, seeking professional guidance together can provide helpful tools. Strong connections aren’t about avoiding struggles but facing them with compassion, honesty, and support.",
        author: "Michael Chen",
        date: "2024-01-12",
        readTime: "7 min read",
        category: "Relationships",
    },
    {
        id: 3,
        title: "Mindfulness Techniques for Stress Relief",
        content:
            "Mindfulness is the practice of being present in the moment, and it can be a powerful tool for reducing stress. One simple method is mindful breathing: focus on slow, steady breaths and notice the rhythm without judgment. Body scanning is another technique—pay attention to each part of your body, releasing tension as you go. Practicing gratitude daily, even writing down three small things you’re thankful for, helps shift focus away from stress. Mindful walking, where you notice your steps and surroundings, also encourages calmness. These exercises are easy to fit into daily routines and don’t require special equipment. With practice, mindfulness can improve focus, lower anxiety, and build resilience against stress, making challenges feel more manageable.",
        author: "Lisa Rodriguez, LCSW",
        date: "2024-01-10",
        readTime: "4 min read",
        category: "Wellness",
    },
    {
        id: 4,
        title: "When to Seek Professional Help",
        content:
            "Knowing when to seek professional help is an important part of caring for your mental health. Occasional stress or sadness is normal, but if these feelings persist for weeks or interfere with daily life, reaching out can make a big difference. Warning signs include constant anxiety, loss of interest in activities, changes in sleep or appetite, or difficulty focusing. Talking with a counselor, therapist, or doctor provides guidance and safe space to process emotions. Seeking help does not mean weakness—it shows strength and self-awareness. Early support often prevents problems from worsening. Remember, just as you’d see a doctor for physical illness, prioritizing mental well-being with professional help is a step toward healing and growth.",
        author: "Emily Watson",
        date: "2024-01-08",
        readTime: "6 min read",
        category: "Support",
    },
    {
        id: 5,
        title: "Overcoming Sleep Challenges Naturally",
        content:
            "Good sleep is vital for both mental and physical health, but stress, screens, or irregular routines can disrupt it. Simple lifestyle changes often help restore balance. Creating a consistent sleep schedule trains the body’s internal clock, while limiting caffeine and heavy meals at night improves rest. Reducing screen time before bed and replacing it with reading or relaxation techniques helps calm the mind. Practicing deep breathing or meditation also eases tension, preparing the body for sleep. If worries keep you awake, journaling thoughts before bed can bring clarity. Natural improvements take patience, but consistent habits can make a big difference. Restful sleep boosts mood, focus, and resilience, helping you face each day with renewed energy.",
        author: "Kevin Lee",
        date: "2024-01-05",
        readTime: "5 min read",
        category: "Wellness",
    },
    {
        id: 6,
        title: "Coping with Work-Related Stress",
        content:
            "Work-related stress is common, but if unmanaged, it can affect performance and overall well-being. Recognizing triggers—like long hours, unclear expectations, or lack of balance—is the first step. Setting boundaries, such as defined work hours and regular breaks, helps maintain energy. Staying organized with to-do lists reduces overwhelm. Building healthy routines outside work, such as exercise, hobbies, and rest, restores balance. Connecting with coworkers for support or delegating tasks when possible prevents burnout. Practicing relaxation techniques during the day, like mindful breathing, can lower tension instantly. If stress becomes overwhelming, talking to a supervisor or seeking counseling may provide solutions. Managing stress doesn’t mean avoiding challenges but handling them with healthy strategies and resilience.",
        author: "Jessica Martinez, PhD",
        date: "2024-01-03",
        readTime: "6 min read",
        category: "Mental Health",
    },
    {
        id: 7,
        title: "Boosting Self-Esteem in Challenging Times",
        content:
            "Self-esteem can take a hit during tough times, but it can also be rebuilt with practice and patience. Start by recognizing your strengths and accomplishments, no matter how small. Positive self-talk helps replace critical thoughts with affirmations of growth and capability. Setting realistic goals and celebrating progress fosters confidence. Surrounding yourself with supportive people reinforces your value and resilience. Practicing self-care—through exercise, hobbies, or rest—improves mood and energy. Remember, setbacks do not define your worth; they are part of learning and growth. By showing kindness to yourself and focusing on progress instead of perfection, you can strengthen self-esteem and face challenges with greater confidence and hope.",
        author: "Amanda Green",
        date: "2024-01-01",
        readTime: "5 min read",
        category: "Personal Development",
    },
    {
        id: 8,
        title: "Nutrition Tips for a Healthy Mind",
        content:
            "What we eat directly impacts our mental health. A balanced diet supports energy, focus, and emotional well-being. Foods rich in omega-3 fatty acids, like walnuts and flaxseeds, boost brain health, while leafy greens and fruits provide vitamins that regulate mood. Whole grains help maintain steady energy levels throughout the day. Limiting processed foods and sugar can prevent energy crashes and mood swings. Staying hydrated is equally important for concentration. Simple changes, like adding nuts, fresh vegetables, and lean proteins, can make a big difference. Nutrition is not about strict rules but balance. Choosing wholesome foods daily fuels both the body and mind, supporting long-term wellness and resilience.",
        author: "Samuel Ortiz",
        date: "2023-12-30",
        readTime: "4 min read",
        category: "Wellness",
    },


];

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find((p) => p.id === Number(id));

    if (!post) {
        return <h2 className="text-center mt-10 text-red-500">Blog not found</h2>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 text-white   rounded-lg bg-black/40 backdrop-blur-md">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-sm text-gray-400 mb-6">
                {post.author} • {new Date(post.date).toLocaleDateString()} • {post.readTime}
            </p>
            <div className="prose max-w-none text-white/80">
                <p>{post.content}</p>
            </div>
        </div>
    );
};

export default BlogPost;

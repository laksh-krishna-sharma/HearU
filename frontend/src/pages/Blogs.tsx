
const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Anxiety: A Guide for Young Adults",
      excerpt: "Learn about the signs, symptoms, and coping strategies for managing anxiety in your daily life.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Mental Health"
    },
    {
      id: 2,
      title: "Building Healthy Relationships During Difficult Times",
      excerpt: "Discover how to maintain and build meaningful connections while prioritizing your mental health.",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Relationships"
    },
    {
      id: 3,
      title: "Mindfulness Techniques for Stress Relief",
      excerpt: "Simple mindfulness exercises you can practice anywhere to reduce stress and improve focus.",
      author: "Lisa Rodriguez, LCSW",
      date: "2024-01-10",
      readTime: "4 min read",
      category: "Wellness"
    },
    {
      id: 4,
      title: "When to Seek Professional Help",
      excerpt: "Understanding the signs that indicate it's time to reach out to a mental health professional.",
      author: "Emily Watson",
      date: "2024-01-08",
      readTime: "6 min read",
      category: "Support"
    },
    {
      id: 5,
      title: "Overcoming Sleep Challenges Naturally",
      excerpt: "Explore practical tips and techniques to improve your sleep without relying on medication.",
      author: "Kevin Lee",
      date: "2024-01-05",
      readTime: "5 min read",
      category: "Wellness"
    },
    {
      id: 6,
      title: "Coping with Work-Related Stress",
      excerpt: "Learn strategies to manage stress at work and maintain a healthy work-life balance.",
      author: "Jessica Martinez, PhD",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Mental Health"
    },
    {
      id: 7,
      title: "Boosting Self-Esteem in Challenging Times",
      excerpt: "Practical advice to strengthen self-confidence and build resilience in daily life.",
      author: "Amanda Green",
      date: "2024-01-01",
      readTime: "5 min read",
      category: "Personal Development"
    },
    {
      id: 8,
      title: "Nutrition Tips for a Healthy Mind",
      excerpt: "Discover how diet impacts mental health and simple changes to support your wellbeing.",
      author: "Samuel Ortiz",
      date: "2023-12-30",
      readTime: "4 min read",
      category: "Wellness"
    },
  ];


  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mental Wellness Blog
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Expert insights, personal stories, and practical tips to support your mental health journey
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-medium text-ocean-primary bg-ocean-primary bg-opacity-10 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-ocean-text opacity-60">
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-ocean-text mb-3 hover:text-ocean-primary transition-colors cursor-pointer">
                  {post.title}
                </h2>

                <p className="text-ocean-text opacity-70 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ocean-text">
                      {post.author}
                    </p>
                    <p className="text-xs text-ocean-text opacity-60">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>

                  <button className="text-ocean-primary hover:text-ocean-primary-dark font-medium text-sm transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
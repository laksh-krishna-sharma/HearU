
const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Anxiety: A Guide for Young Adults",
      excerpt: "Learn about the signs, symptoms, and coping strategies for managing anxiety in your daily life.",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Mental Health"
    },
    {
      id: 2,
      title: "Building Healthy Relationships During Difficult Times",
      excerpt: "Discover how to maintain and build meaningful connections while prioritizing your mental health.",
      author: "Dr. Michael Chen",
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
      author: "Dr. Emily Watson",
      date: "2024-01-08",
      readTime: "6 min read",
      category: "Support"
    }
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
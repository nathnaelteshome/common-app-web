export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  authorId: string
  universityId: string
  universityName: string
  category: string
  tags: string[]
  status: "draft" | "published" | "scheduled" | "archived"
  commentCount: number
  readTime: number
  featured: boolean
  views: number
  likes: number
  scheduledDate?: string
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
  color: string
}

export interface BlogComment {
  id: string
  postId: string
  authorName: string
  authorEmail: string
  content: string
  status: "approved" | "pending" | "spam"
  createdAt: string
  replies: BlogComment[]
}

export interface BlogAnalytics {
  postId: string
  views: number
  uniqueViews: number
  likes: number
  shares: number
  comments: number
  avgReadTime: number
  bounceRate: number
  topReferrers: { source: string; count: number }[]
  viewsByDate: { date: string; views: number }[]
}

// Mock blog categories for university admins
export const blogCategories: BlogCategory[] = [
  {
    id: "1",
    name: "University News",
    slug: "university-news",
    description: "Latest news and updates from our university",
    count: 15,
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "Academic Programs",
    slug: "academic-programs",
    description: "Information about our academic offerings",
    count: 12,
    color: "#10B981",
  },
  {
    id: "3",
    name: "Student Life",
    slug: "student-life",
    description: "Campus life, events, and student activities",
    count: 18,
    color: "#F59E0B",
  },
  {
    id: "4",
    name: "Research & Innovation",
    slug: "research-innovation",
    description: "Research breakthroughs and innovations",
    count: 8,
    color: "#8B5CF6",
  },
  {
    id: "5",
    name: "Admissions",
    slug: "admissions",
    description: "Admission requirements and application tips",
    count: 10,
    color: "#EF4444",
  },
  {
    id: "6",
    name: "Alumni Success",
    slug: "alumni-success",
    description: "Success stories from our graduates",
    count: 6,
    color: "#06B6D4",
  },
]

// Mock blog posts for university admin
export const mockUniversityBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "new-engineering-building-opens",
    title: "State-of-the-Art Engineering Building Opens at Addis Ababa University",
    excerpt:
      "Our new 5-story engineering facility features cutting-edge laboratories, collaborative spaces, and sustainable design elements.",
    content: `We are thrilled to announce the grand opening of our new Engineering and Technology Building, a milestone achievement that represents our commitment to providing world-class education and research facilities.

## Building Features

The new facility spans 50,000 square feet across five floors and includes:

### Advanced Laboratories
- **Robotics and Automation Lab**: Equipped with industrial robots and IoT devices
- **Materials Testing Lab**: State-of-the-art equipment for structural analysis
- **Computer Vision Lab**: High-performance computing clusters for AI research
- **Clean Energy Lab**: Solar panel testing and wind energy simulation equipment

### Collaborative Spaces
- **Innovation Hub**: Open workspace for student projects and startups
- **Conference Rooms**: Video conferencing capabilities for international collaboration
- **Study Areas**: Quiet zones and group study rooms throughout the building

### Sustainable Design
The building incorporates numerous green technologies:
- Solar panels providing 40% of the building's energy needs
- Rainwater harvesting system for irrigation
- Energy-efficient LED lighting with motion sensors
- Natural ventilation systems reducing cooling costs

## Impact on Education

This new facility will directly benefit over 2,000 engineering students and 150 faculty members. The enhanced learning environment will:

- Provide hands-on experience with industry-standard equipment
- Foster collaboration between different engineering disciplines
- Support research partnerships with international universities
- Create opportunities for student-led innovation projects

## Community Partnerships

The building was made possible through partnerships with:
- **Ethiopian Ministry of Education**: Primary funding and policy support
- **German Development Cooperation (GIZ)**: Technical expertise and equipment
- **Local Construction Companies**: Sustainable building practices
- **Alumni Network**: Fundraising and mentorship programs

## Future Plans

This is the first phase of our campus modernization initiative. Upcoming projects include:
- New library and information center (2025)
- Student recreation complex (2026)
- Research and development park (2027)

We invite the community to visit during our open house events scheduled throughout the month. Tours are available Monday through Friday from 9 AM to 4 PM.

The Engineering Building represents more than just infrastructure – it's an investment in Ethiopia's technological future and our students' success.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "January 15, 2025",
    author: "Dr. Alemayehu Tadesse",
    authorId: "admin-1",
    universityId: "aau-001",
    universityName: "Addis Ababa University",
    category: "University News",
    tags: ["engineering", "infrastructure", "technology", "sustainability"],
    status: "published",
    commentCount: 23,
    readTime: 6,
    featured: true,
    views: 1250,
    likes: 89,
    seoTitle: "New Engineering Building Opens at AAU - Advanced Facilities for Students",
    seoDescription:
      "Discover the new state-of-the-art engineering building at Addis Ababa University with advanced labs, sustainable design, and collaborative spaces.",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "2",
    slug: "scholarship-program-announcement",
    title: "New Merit-Based Scholarship Program for Outstanding Students",
    excerpt:
      "We're launching a comprehensive scholarship program offering full tuition coverage for academically excellent students from underserved communities.",
    content: `We are proud to announce the launch of our new Merit-Based Scholarship Program, designed to support exceptional students who demonstrate academic excellence and leadership potential.

## Program Overview

The scholarship program aims to:
- Remove financial barriers for deserving students
- Promote diversity and inclusion on campus
- Support students from underserved communities
- Foster academic excellence and leadership

## Scholarship Benefits

### Full Scholarship Package
- **Complete tuition coverage** for 4 years
- **Monthly living allowance** of 3,000 ETB
- **Book and supplies stipend** of 2,000 ETB per semester
- **Laptop and technology support**
- **Mentorship program** with faculty and alumni

### Additional Support Services
- Academic tutoring and support
- Career counseling and internship placement
- Leadership development workshops
- Networking opportunities with industry professionals

## Eligibility Criteria

To qualify for the scholarship, applicants must:

### Academic Requirements
- Minimum GPA of 3.8 in high school
- Top 10% of graduating class
- Strong performance in mathematics and sciences
- Demonstrated commitment to community service

### Financial Need
- Family income below specified threshold
- Documentation of financial hardship
- Priority given to first-generation college students

### Leadership and Character
- Evidence of leadership roles in school or community
- Strong letters of recommendation
- Personal essay demonstrating goals and values
- Interview with scholarship committee

## Application Process

### Timeline
- **Application Opens**: February 1, 2025
- **Application Deadline**: April 30, 2025
- **Interviews**: May 15-30, 2025
- **Awards Announced**: June 15, 2025

### Required Documents
1. Completed application form
2. Official high school transcripts
3. Two letters of recommendation
4. Personal statement (500-750 words)
5. Financial documentation
6. Community service verification

## Selection Process

Applications will be reviewed by a committee comprising:
- Faculty representatives from each college
- Student affairs professionals
- Alumni volunteers
- Community leaders

Selection criteria include:
- Academic achievement (40%)
- Financial need (30%)
- Leadership potential (20%)
- Community impact (10%)

## Program Impact

We expect to award 50 scholarships in the first year, with plans to expand to 100 scholarships annually by 2027. This represents an investment of over 15 million ETB in student success.

## How to Apply

Visit our scholarship portal at [university-website]/scholarships or contact our Financial Aid Office:
- **Phone**: +251-11-123-4567
- **Email**: scholarships@university.edu.et
- **Office Hours**: Monday-Friday, 8:00 AM - 5:00 PM

Information sessions will be held in major cities across Ethiopia. Check our website for dates and locations.

This scholarship program reflects our commitment to making quality higher education accessible to all deserving students, regardless of their economic background.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "January 12, 2025",
    author: "Dr. Hanan Mohammed",
    authorId: "admin-2",
    universityId: "aau-001",
    universityName: "Addis Ababa University",
    category: "Admissions",
    tags: ["scholarships", "financial aid", "students", "merit-based"],
    status: "published",
    commentCount: 45,
    readTime: 5,
    featured: true,
    views: 2100,
    likes: 156,
    seoTitle: "Merit-Based Scholarship Program - Full Tuition Coverage Available",
    seoDescription:
      "Apply for our new merit-based scholarship program offering full tuition coverage, living allowance, and comprehensive support for outstanding students.",
    createdAt: "2025-01-12T10:30:00Z",
    updatedAt: "2025-01-12T10:30:00Z",
  },
  {
    id: "3",
    slug: "research-breakthrough-malaria",
    title: "University Researchers Make Breakthrough in Malaria Prevention",
    excerpt:
      "Our medical research team has developed a new approach to malaria prevention that could significantly reduce infection rates in rural communities.",
    content: `Researchers at our Medical School have achieved a significant breakthrough in malaria prevention, developing an innovative community-based intervention that has shown remarkable results in pilot studies.

## Research Overview

The three-year study, led by Dr. Tigist Bekele and her team, focused on developing sustainable malaria prevention strategies specifically designed for rural Ethiopian communities.

### Key Findings
- **67% reduction** in malaria incidence in intervention communities
- **Cost-effective implementation** at $2.50 per person protected
- **High community acceptance** with 94% participation rate
- **Sustainable model** that can be replicated across Africa

## Innovative Approach

### Community Health Worker Training
The program trained local community health workers in:
- Early detection and rapid testing
- Proper use of bed nets and indoor spraying
- Health education and behavior change
- Data collection and reporting

### Technology Integration
- **Mobile health (mHealth) platform** for real-time data collection
- **SMS-based reminders** for medication adherence
- **GPS mapping** of high-risk areas
- **Weather-based prediction models** for outbreak prevention

### Environmental Management
- Community-led elimination of breeding sites
- Improved water storage and management
- Sustainable drainage systems
- Natural larvicide production from local plants

## Study Results

### Primary Outcomes
The intervention was tested in 12 rural communities (population: 15,000) over 24 months:

**Malaria Incidence**
- Baseline: 450 cases per 1,000 people annually
- Post-intervention: 148 cases per 1,000 people annually
- Reduction: 67% (p<0.001)

**Severe Malaria Cases**
- 78% reduction in hospitalizations
- 85% reduction in malaria-related deaths
- 60% reduction in treatment costs

### Secondary Outcomes
- Improved knowledge about malaria prevention (89% increase)
- Increased bed net usage (from 34% to 91%)
- Better healthcare-seeking behavior
- Enhanced community health system capacity

## Global Impact Potential

### Scalability
The intervention model has been designed for easy replication:
- **Low-cost materials** available locally
- **Simple training protocols** for health workers
- **Culturally appropriate** messaging and approaches
- **Integration** with existing health systems

### International Recognition
- **World Health Organization** has expressed interest in the model
- **Gates Foundation** is considering funding for scale-up
- **African Union** invited presentation at health ministers' meeting
- **Peer-reviewed publication** in The Lancet Global Health

## Next Steps

### Phase 2 Implementation
With additional funding secured, the team plans to:
- Expand to 50 communities across three regions
- Develop training materials in local languages
- Create mobile app for community health workers
- Establish monitoring and evaluation systems

### Policy Implications
The research findings are informing:
- National malaria control strategy updates
- Community health worker policy development
- Health system strengthening initiatives
- International development program design

## Research Team

The multidisciplinary team includes:
- **Dr. Tigist Bekele** - Principal Investigator, Public Health
- **Dr. Samuel Getachew** - Epidemiologist
- **Dr. Ruth Alemseged** - Community Health Specialist
- **Ato Dawit Tadesse** - Health Systems Researcher
- **Dr. Meron Teshome** - Biostatistician

## Funding and Partnerships

This research was supported by:
- Ethiopian Ministry of Health
- Wellcome Trust Global Health Research Grant
- University Research Fund
- Local community contributions

## Community Impact

Beyond the health outcomes, the program has:
- Created 120 paid community health worker positions
- Strengthened local health committees
- Improved overall health system capacity
- Enhanced community resilience and self-reliance

This breakthrough demonstrates the power of community-centered research and the potential for locally-developed solutions to address global health challenges.

The research team is now preparing for wider implementation and looks forward to sharing their methodology with researchers and practitioners worldwide.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "January 10, 2025",
    author: "Dr. Tigist Bekele",
    authorId: "admin-3",
    universityId: "aau-001",
    universityName: "Addis Ababa University",
    category: "Research & Innovation",
    tags: ["research", "malaria", "public health", "community health"],
    status: "published",
    commentCount: 31,
    readTime: 8,
    featured: false,
    views: 890,
    likes: 67,
    seoTitle: "Malaria Prevention Breakthrough - 67% Reduction in Rural Communities",
    seoDescription:
      "University researchers achieve significant breakthrough in malaria prevention with community-based intervention showing 67% reduction in infection rates.",
    createdAt: "2025-01-10T14:15:00Z",
    updatedAt: "2025-01-10T14:15:00Z",
  },
]

// Mock blog comments
export const mockBlogComments: BlogComment[] = [
  {
    id: "1",
    postId: "1",
    authorName: "Meron Tadesse",
    authorEmail: "meron.t@email.com",
    content:
      "This is fantastic news! As an engineering student, I'm excited to use these new facilities. When will the robotics lab be fully operational?",
    status: "approved",
    createdAt: "2025-01-15T10:30:00Z",
    replies: [
      {
        id: "1-1",
        postId: "1",
        authorName: "Dr. Alemayehu Tadesse",
        authorEmail: "alemayehu.t@university.edu.et",
        content:
          "Hi Meron! The robotics lab will be fully operational by February 1st. We're currently conducting final equipment testing and safety training for staff.",
        status: "approved",
        createdAt: "2025-01-15T11:45:00Z",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    postId: "2",
    authorName: "Dawit Haile",
    authorEmail: "dawit.h@email.com",
    content:
      "This scholarship program sounds amazing! I'm a high school senior with a 3.9 GPA. Where can I find the application form?",
    status: "approved",
    createdAt: "2025-01-12T16:20:00Z",
    replies: [],
  },
]

// Mock blog analytics
export const mockBlogAnalytics: BlogAnalytics[] = [
  {
    postId: "1",
    views: 1250,
    uniqueViews: 980,
    likes: 89,
    shares: 34,
    comments: 23,
    avgReadTime: 4.2,
    bounceRate: 0.32,
    topReferrers: [
      { source: "Facebook", count: 450 },
      { source: "Google", count: 320 },
      { source: "Twitter", count: 180 },
      { source: "Direct", count: 300 },
    ],
    viewsByDate: [
      { date: "2025-01-15", views: 450 },
      { date: "2025-01-16", views: 320 },
      { date: "2025-01-17", views: 280 },
      { date: "2025-01-18", views: 200 },
    ],
  },
]

// Utility functions
export function getBlogPostsByUniversity(universityId: string): BlogPost[] {
  return mockUniversityBlogPosts.filter((post) => post.universityId === universityId)
}

export function getBlogPostsByAuthor(authorId: string): BlogPost[] {
  return mockUniversityBlogPosts.filter((post) => post.authorId === authorId)
}

export function getBlogPostsByStatus(status: BlogPost["status"]): BlogPost[] {
  return mockUniversityBlogPosts.filter((post) => post.status === status)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return mockUniversityBlogPosts.filter((post) => post.category === category)
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return mockUniversityBlogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getBlogAnalytics(postId: string): BlogAnalytics | undefined {
  return mockBlogAnalytics.find((analytics) => analytics.postId === postId)
}

export function getCommentsByPost(postId: string): BlogComment[] {
  return mockBlogComments.filter((comment) => comment.postId === postId)
}

export function getBlogStats() {
  const totalPosts = mockUniversityBlogPosts.length
  const publishedPosts = getBlogPostsByStatus("published").length
  const draftPosts = getBlogPostsByStatus("draft").length
  const totalViews = mockUniversityBlogPosts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = mockUniversityBlogPosts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = mockUniversityBlogPosts.reduce((sum, post) => sum + post.commentCount, 0)

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalLikes,
    totalComments,
    avgViewsPerPost: Math.round(totalViews / totalPosts),
    avgLikesPerPost: Math.round(totalLikes / totalPosts),
  }
}

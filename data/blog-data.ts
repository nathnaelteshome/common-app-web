export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  category: string
  tags: string[]
  commentCount: number
  readTime: number
  featured: boolean
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  count: number
}

export const blogCategories: BlogCategory[] = [
  {
    id: "1",
    name: "Education Announcements",
    slug: "education-announcements",
    count: 2,
  },
  {
    id: "2",
    name: "University News",
    slug: "university-news",
    count: 2,
  },
  {
    id: "3",
    name: "Technology News",
    slug: "technology-news",
    count: 1,
  },
  {
    id: "4",
    name: "Scholarship Opportunities",
    slug: "scholarship-opportunities",
    count: 1,
  },
  {
    id: "5",
    name: "Student Life",
    slug: "student-life",
    count: 0,
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "university-entrance-requirements-2024",
    title: "Complete Guide to University Entrance Requirements for 2024",
    excerpt:
      "Everything you need to know about university admission requirements, from GPA standards to standardized test scores and application deadlines.",
    content: `Navigating university entrance requirements can be overwhelming, but understanding what admissions committees look for will give you a significant advantage in your application process.

## Academic Requirements

Most universities require a minimum GPA of 3.0 for undergraduate programs, though competitive institutions often expect 3.5 or higher. Your academic transcript should demonstrate consistent performance across core subjects including:

- Mathematics (4 years recommended)
- English/Language Arts (4 years required)
- Science (3-4 years, including lab sciences)
- Social Studies (3-4 years)
- Foreign Language (2-3 years recommended)

## Standardized Testing

While many universities have adopted test-optional policies, standardized test scores can still strengthen your application:

- **SAT**: Average scores range from 1200-1500 for competitive schools
- **ACT**: Composite scores of 26-34 are typically competitive
- **International Students**: TOEFL (80+) or IELTS (6.5+) scores required

## Application Components

Beyond grades and test scores, universities evaluate:

1. **Personal Essays**: Demonstrate your unique perspective and goals
2. **Letters of Recommendation**: Choose recommenders who know you well
3. **Extracurricular Activities**: Show leadership and commitment
4. **Community Service**: Highlight your impact on others

## Important Deadlines

- **Early Decision/Action**: November 1-15
- **Regular Decision**: January 1-15
- **Rolling Admissions**: Applications accepted year-round

Start your application process early to ensure you meet all requirements and deadlines. Remember, each university has unique requirements, so research thoroughly and create a checklist for each school on your list.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "December 15, 2024",
    author: "Sarah Johnson",
    category: "University News",
    tags: ["admissions", "requirements", "applications", "2024"],
    commentCount: 24,
    readTime: 8,
    featured: true,
  },
  {
    id: "2",
    slug: "scholarship-opportunities-guide",
    title: "Top 10 Scholarship Opportunities Every Student Should Know About",
    excerpt:
      "Discover the best scholarship programs available for undergraduate and graduate students, including application tips and deadlines.",
    content: `Scholarships can significantly reduce the financial burden of higher education. Here are the top scholarship opportunities you should consider applying for in 2024.

## Merit-Based Scholarships

### 1. National Merit Scholarship Program
- **Award**: Up to $2,500 annually
- **Eligibility**: High PSAT/NMSQT scores
- **Deadline**: October (PSAT test date)

### 2. Coca-Cola Scholars Program
- **Award**: $20,000
- **Eligibility**: High school seniors with leadership experience
- **Deadline**: October 31

## Need-Based Scholarships

### 3. Federal Pell Grant
- **Award**: Up to $7,395 annually
- **Eligibility**: Demonstrated financial need
- **Deadline**: June 30 (FAFSA)

### 4. Gates Scholarship
- **Award**: Full cost of attendance
- **Eligibility**: Minority students with exceptional academic records
- **Deadline**: September 15

## Field-Specific Scholarships

### 5. STEM Scholarships
- **Various Programs**: $1,000 - $10,000
- **Fields**: Science, Technology, Engineering, Mathematics
- **Deadlines**: Vary by program

## Application Tips

1. **Start Early**: Begin researching scholarships in your junior year
2. **Stay Organized**: Create a spreadsheet with deadlines and requirements
3. **Tailor Applications**: Customize essays for each scholarship
4. **Meet Deadlines**: Submit applications well before due dates
5. **Follow Up**: Confirm receipt of your application materials

Remember, scholarship applications require time and effort, but the financial benefits make it worthwhile. Apply to multiple scholarships to maximize your chances of success.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "December 10, 2024",
    author: "Michael Chen",
    category: "Scholarship Opportunities",
    tags: ["scholarships", "financial aid", "students", "funding"],
    commentCount: 18,
    readTime: 6,
    featured: true,
  },
  {
    id: "3",
    slug: "college-application-essay-tips",
    title: "How to Write a Compelling College Application Essay That Stands Out",
    excerpt:
      "Master the art of college essay writing with proven strategies, examples, and expert tips from admissions counselors.",
    content: `Your college application essay is your opportunity to show admissions committees who you are beyond grades and test scores. Here's how to craft an essay that makes a lasting impression.

## Understanding the Prompt

Before you start writing, carefully analyze the essay prompt:
- Identify key words and phrases
- Understand what the admissions committee wants to learn about you
- Brainstorm experiences that relate to the prompt

## Choosing Your Topic

The best essays often focus on:
- A specific moment or experience that changed you
- A challenge you overcame
- A passion or interest that drives you
- A unique perspective you bring

## Structure and Organization

### Introduction
- Start with a compelling hook
- Provide context for your story
- Preview your main message

### Body Paragraphs
- Use specific examples and details
- Show, don't just tell
- Connect experiences to personal growth

### Conclusion
- Reflect on lessons learned
- Connect to your future goals
- Leave a lasting impression

## Writing Tips

1. **Be Authentic**: Write in your own voice
2. **Show Growth**: Demonstrate how experiences changed you
3. **Use Specific Details**: Avoid generic statements
4. **Stay Focused**: Stick to one main theme or message
5. **Revise Thoroughly**: Multiple drafts improve quality

## Common Mistakes to Avoid

- Writing about what you think admissions officers want to hear
- Using clichéd topics without a unique angle
- Focusing too much on achievements rather than personal growth
- Exceeding word limits
- Submitting without proofreading

## Final Thoughts

Remember, your essay should complement the rest of your application, not repeat information found elsewhere. Take time to craft a thoughtful, authentic piece that showcases your personality and potential.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "December 8, 2024",
    author: "Dr. Emily Rodriguez",
    category: "Education Announcements",
    tags: ["essays", "applications", "writing", "admissions"],
    commentCount: 31,
    readTime: 7,
    featured: true,
  },
  {
    id: "4",
    slug: "stem-career-opportunities-2024",
    title: "Emerging STEM Career Opportunities in 2024 and Beyond",
    excerpt:
      "Explore the fastest-growing STEM careers, required education, and salary expectations in today's technology-driven world.",
    content: `The STEM field continues to evolve rapidly, creating exciting new career opportunities for students entering college. Here are the most promising STEM careers to consider.

## Technology and Computing

### Artificial Intelligence Engineer
- **Median Salary**: $130,000 - $200,000
- **Education**: Bachelor's in Computer Science or related field
- **Growth Rate**: 22% (much faster than average)

### Cybersecurity Specialist
- **Median Salary**: $95,000 - $150,000
- **Education**: Bachelor's in Cybersecurity or Computer Science
- **Growth Rate**: 35% (much faster than average)

## Healthcare and Biotechnology

### Biomedical Engineer
- **Median Salary**: $85,000 - $120,000
- **Education**: Bachelor's in Biomedical Engineering
- **Growth Rate**: 6% (faster than average)

### Genetic Counselor
- **Median Salary**: $80,000 - $100,000
- **Education**: Master's in Genetic Counseling
- **Growth Rate**: 26% (much faster than average)

## Environmental Science

### Environmental Data Scientist
- **Median Salary**: $90,000 - $130,000
- **Education**: Bachelor's in Environmental Science + Data Science skills
- **Growth Rate**: 8% (faster than average)

## Preparing for STEM Careers

1. **Strong Foundation**: Excel in mathematics and science courses
2. **Hands-on Experience**: Participate in research projects and internships
3. **Technical Skills**: Learn programming languages and data analysis tools
4. **Soft Skills**: Develop communication and teamwork abilities
5. **Continuous Learning**: Stay updated with industry trends

The future of STEM is bright, with new opportunities emerging as technology advances. Choose a field that aligns with your interests and strengths for a rewarding career.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "December 5, 2024",
    author: "Dr. James Park",
    category: "Technology News",
    tags: ["STEM", "careers", "technology", "future"],
    commentCount: 15,
    readTime: 5,
    featured: false,
  },
  {
    id: "5",
    slug: "international-student-guide",
    title: "Complete Guide for International Students Applying to US Universities",
    excerpt:
      "Navigate the complex process of applying to US universities as an international student, from visa requirements to cultural adaptation.",
    content: `Applying to US universities as an international student involves unique challenges and requirements. This comprehensive guide will help you navigate the process successfully.

## Academic Requirements

### English Proficiency Tests
- **TOEFL iBT**: Minimum score 80-100 (varies by university)
- **IELTS Academic**: Minimum score 6.5-7.0
- **Duolingo English Test**: Accepted by many universities

### Academic Credentials
- Transcript evaluation through services like WES or ECE
- Grade conversion to US GPA scale
- Official transcripts in English

## Application Process

### Standardized Tests
- **SAT/ACT**: Required by most universities
- **Subject Tests**: May be required for specific programs
- **GRE/GMAT**: For graduate programs

### Application Materials
1. **Common Application or university-specific application**
2. **Personal statement/essays**
3. **Letters of recommendation**
4. **Financial documentation**
5. **Portfolio (for arts programs)**

## Financial Considerations

### Tuition and Living Costs
- **Public Universities**: $25,000 - $40,000 annually
- **Private Universities**: $40,000 - $70,000 annually
- **Living Expenses**: $15,000 - $25,000 annually

### Financial Aid Options
- Merit-based scholarships
- Need-based aid (limited for international students)
- Graduate assistantships
- External scholarships

## Visa Process

### F-1 Student Visa
1. Receive I-20 form from university
2. Pay SEVIS fee
3. Complete DS-160 application
4. Schedule visa interview
5. Prepare required documents

## Cultural Adaptation Tips

1. **Academic Culture**: Understand classroom participation expectations
2. **Social Integration**: Join student organizations and clubs
3. **Support Services**: Utilize international student services
4. **Communication**: Practice English conversation skills
5. **Cultural Awareness**: Learn about American customs and traditions

## Timeline for Applications

- **Junior Year**: Research universities, prepare for standardized tests
- **Senior Year Fall**: Submit applications, apply for financial aid
- **Senior Year Spring**: Make final decisions, apply for visa
- **Summer**: Prepare for departure, attend orientation programs

Starting early and staying organized are key to a successful application process. Don't hesitate to reach out to university admissions offices for guidance.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "December 1, 2024",
    author: "Maria Gonzalez",
    category: "University News",
    tags: ["international", "students", "applications", "visa"],
    commentCount: 22,
    readTime: 9,
    featured: false,
  },
  {
    id: "6",
    slug: "college-campus-visit-guide",
    title: "Making the Most of Your College Campus Visits: A Complete Checklist",
    excerpt:
      "Maximize your college visits with this comprehensive guide covering what to see, questions to ask, and how to evaluate your options.",
    content: `Campus visits are crucial for making informed college decisions. Here's how to make the most of your time on campus and gather the information you need.

## Before Your Visit

### Research and Planning
- Review the university website thoroughly
- Check academic programs of interest
- Note campus facilities and resources
- Prepare a list of specific questions

### Schedule Your Visit
- **Official Tours**: Register for admissions tours
- **Information Sessions**: Attend presentations about academics and student life
- **Class Visits**: Arrange to sit in on classes
- **Overnight Stays**: Consider staying with current students

## During Your Visit

### Academic Evaluation
- **Facilities**: Visit libraries, labs, and study spaces
- **Faculty**: Meet with professors in your area of interest
- **Class Size**: Observe typical class sizes and teaching styles
- **Resources**: Check research opportunities and academic support

### Campus Life Assessment
- **Dining**: Try the campus food options
- **Housing**: Tour different residence hall options
- **Activities**: Visit student centers and recreational facilities
- **Safety**: Observe campus security measures

### Questions to Ask

#### For Admissions Officers
1. What makes your university unique?
2. What are the most popular majors?
3. What is the average class size?
4. What career services are available?
5. What is the graduation rate?

#### For Current Students
1. What do you like most about this school?
2. What would you change if you could?
3. How accessible are professors?
4. What do students do for fun?
5. How is the workload?

#### For Faculty
1. What research opportunities exist for undergraduates?
2. How do you support student success?
3. What career paths do graduates typically pursue?
4. What makes your program special?

## After Your Visit

### Evaluation Process
- **Take Notes**: Record impressions while they're fresh
- **Compare Options**: Create a pros and cons list
- **Follow Up**: Send thank-you notes to people you met
- **Stay Connected**: Join mailing lists for updates

### Decision Factors
1. **Academic Fit**: Does the school offer strong programs in your areas of interest?
2. **Social Fit**: Can you see yourself thriving in this environment?
3. **Financial Fit**: Is the cost manageable for your family?
4. **Geographic Fit**: Are you comfortable with the location and climate?
5. **Size Fit**: Do you prefer a large research university or smaller college?

## Virtual Visit Options

If you can't visit in person:
- Take virtual tours
- Attend online information sessions
- Connect with current students via social media
- Schedule virtual meetings with admissions counselors

## Final Tips

- Visit during the academic year when students are on campus
- Stay overnight if possible to get a true feel for campus life
- Trust your instincts about whether you feel comfortable
- Remember that no school is perfect – focus on the best overall fit

Campus visits are investments in your future. Take them seriously, but also enjoy the process of discovering where you might spend the next four years of your life.`,
    image: "/placeholder.svg?height=400&width=600",
    date: "November 28, 2024",
    author: "David Thompson",
    category: "Education Announcements",
    tags: ["campus visits", "college tours", "decision making", "students"],
    commentCount: 19,
    readTime: 8,
    featured: false,
  },
]

export function getBlogPosts(): BlogPost[] {
  return blogPosts
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentPostId: string, category: string, limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.id !== currentPostId && post.category === category).slice(0, limit)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
